import inquirer from 'inquirer';
import {DBConfig} from "../types/types";
import chalk from "chalk";


export async function promptCredentials(dbName: string): Promise<DBConfig> {
    console.log(`\n${dbName} Database Configuration:`);
    return inquirer.prompt([
        { name: 'host', message: 'Host:', default: 'localhost' },
        { name: 'port', message: 'Port:', default: 3306, type: 'number' },
        { name: 'user', message: 'User:', default: 'root' },
        { name: 'password', message: 'Password:', type: 'password', mask: '*' },
        { name: 'database', message: 'Database name:' },
    ]);
}

export async function confirmAction(message: string): Promise<boolean> {
    const answer = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmed',
            message,
            default: false,
        },
    ]);
    return answer.confirmed;
}

export async function showMainMenu(sourceConnected: boolean, targetConnected: boolean): Promise<string> {
    const choices = [
        { name: '🔌 Test Connection', value: 'test' },
    ];

    if (sourceConnected && targetConnected) {
        choices.push(
            { name: '📋 Copy Database (Source → Target)', value: 'copy' },
            { name: '💾 Backup Source Database', value: 'backup-source' },
            { name: '💾 Backup Target Database', value: 'backup-target' }
        );
    } else {
        choices.push(
            { name: chalk.gray('📋 Copy Database (Test connection first)'), value: 'copy-disabled' },
            { name: chalk.gray('💾 Backup Database (Test connection first)'), value: 'backup-disabled' }
        );
    }

    choices.push({ name: '❌ Exit', value: 'exit' });

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices,
        },
    ]);

    return answer.action;
}