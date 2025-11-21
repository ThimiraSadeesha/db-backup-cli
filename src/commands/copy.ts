import ora from 'ora';
import chalk from 'chalk';

import { confirmAction } from '../utils/prompts';
import { getConnection } from '../utils/connection';
import {DBConfig} from "../types/types";

export async function copyCommand(srcConfig: DBConfig, tgtConfig: DBConfig): Promise<void> {
    console.log(chalk.yellow(`\n⚠️  Warning: This will replace all data in ${tgtConfig.database}`));
    const confirmed = await confirmAction(
        `Copy from ${srcConfig.database} to ${tgtConfig.database}?`
    );

    if (!confirmed) {
        console.log(chalk.red('❌ Operation cancelled'));
        return;
    }

    const spinner = ora('Starting copy process...').start();

    try {
        const srcConn = await getConnection(srcConfig);
        const tgtConn = await getConnection(tgtConfig);

        // Get all tables from source
        spinner.text = 'Reading source database schema...';
        const [tables] = await srcConn.query<any[]>('SHOW TABLES');
        const tableNames = tables.map((t) => Object.values(t)[0] as string);

        spinner.text = `Found ${tableNames.length} tables to copy`;

        // Disable foreign key checks
        await tgtConn.query('SET FOREIGN_KEY_CHECKS = 0');

        for (let i = 0; i < tableNames.length; i++) {
            const tableName = tableNames[i];
            spinner.text = `Copying table ${i + 1}/${tableNames.length}: ${tableName}`;

            // Get CREATE TABLE statement
            const [createStmt] = await srcConn.query<any[]>(`SHOW CREATE TABLE \`${tableName}\``);
            const createSQL = createStmt[0]['Create Table'];

            // Drop and recreate table
            await tgtConn.query(`DROP TABLE IF EXISTS \`${tableName}\``);
            await tgtConn.query(createSQL);

            // Copy data
            const [rows] = await srcConn.query(`SELECT * FROM \`${tableName}\``);

            if (Array.isArray(rows) && rows.length > 0) {
                const columns = Object.keys(rows[0]);
                const placeholders = columns.map(() => '?').join(',');
                const insertSQL = `INSERT INTO \`${tableName}\` (${columns.map((c) => `\`${c}\``).join(',')}) VALUES (${placeholders})`;

                for (const row of rows as any[]) {
                    const values = columns.map((col) => (row as any)[col]);
                    await tgtConn.query(insertSQL, values);
                }
            }
        }

        // Re-enable foreign key checks
        await tgtConn.query('SET FOREIGN_KEY_CHECKS = 1');

        await srcConn.end();
        await tgtConn.end();

        spinner.succeed(chalk.green(`Successfully copied ${tableNames.length} tables from ${srcConfig.database} to ${tgtConfig.database}`));
    } catch (error: any) {
        spinner.fail(chalk.red(`Copy failed: ${error.message}`));
    }
}