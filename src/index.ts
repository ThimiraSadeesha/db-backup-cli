#!/usr/bin/env node
import { program } from 'commander';

import { backupMySQL } from './commands/backup';
import { restoreMySQL } from './commands/restore';
import {testConnection} from "./commands/connection-test";

// Banner
const banner = `
╔═══════════════════════════════════════════════════╗
║                                                   ║
║        Database Backup & Restore CLI Tool         ║
║                                                   ║
║   Support: MySQL, PostgreSQL, MongoDB             ║
║   Storage: Local, AWS S3, GCS, Azure              ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
`;

console.log(banner);

// CLI setup
program
    .name('db-backup')
    .description('A comprehensive database backup and restore CLI tool')
    .version('1.0.0');

// Test connection command
// Test connection command
program
    .command('test-conn')
    .description('Test MySQL connection')
    .requiredOption('-h, --host <host>')
    .option('--port <port>', 'Database port', '3306') // <-- add this
    .requiredOption('-u, --user <user>')
    .requiredOption('-p, --password <password>')
    .requiredOption('-d, --database <database>')
    .action(async (opts) => {
        // convert port to number
        const config = {
            host: opts.host,
            port: Number(opts.port),
            user: opts.user,
            password: opts.password,
            database: opts.database,
        };
        await testConnection(config);
    });


// Backup command
program
    .command('backup')
    .description('Backup MySQL database')
    .requiredOption('-h, --host <host>')
    .requiredOption('-u, --user <user>')
    .requiredOption('-p, --password <password>')
    .requiredOption('-d, --database <database>')
    .requiredOption('-o, --outputDir <outputDir>')
    .option('-c, --compress', 'Compress backup')
    .action(async (opts) => {
        await backupMySQL(opts);
    });

// Restore command
program
    .command('restore')
    .description('Restore MySQL database from backup')
    .requiredOption('-h, --host <host>')
    .requiredOption('-u, --user <user>')
    .requiredOption('-p, --password <password>')
    .requiredOption('-d, --database <database>')
    .requiredOption('-f, --backupFile <backupFile>')
    .action(async (opts) => {
        await restoreMySQL(opts);
    });

program.parse(process.argv);
