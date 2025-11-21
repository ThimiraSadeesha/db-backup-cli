import mysql from 'mysql2/promise';
import chalk from 'chalk';
import {DBConfig} from "../types/types";


export async function testConnection(config: DBConfig): Promise<boolean> {
    try {
        const connection = await mysql.createConnection(config);
        await connection.ping();
        await connection.end();
        console.log(chalk.green(`✅ Connection successful: ${config.host}:${config.port} -> ${config.database}`));
        return true;
    } catch (err: any) {
        console.log(chalk.red(`❌ Connection failed: ${config.host}:${config.port} -> ${config.database}`));
        console.log(chalk.red(`   Error: ${err.message}`));
        return false;
    }
}

export async function getConnection(config: DBConfig) {
    return mysql.createConnection(config);
}