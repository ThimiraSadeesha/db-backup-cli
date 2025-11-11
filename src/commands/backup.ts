import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

interface BackupOptions {
    host: string;
    user: string;
    password: string;
    database: string;
    outputDir: string;
    compress?: boolean;
}

export async function backupMySQL(options: BackupOptions) {
    try {
        const fileName = `${options.database}-${Date.now()}.sql`;
        const filePath = path.join(options.outputDir, fileName);
        const cmd = `mysqldump -h ${options.host} -u ${options.user} -p${options.password} ${options.database} > ${filePath}`;
        await new Promise<void>((resolve, reject) => {
            exec(cmd, (error) => {
                if (error) return reject(error);
                resolve();
            });
        });
        if (options.compress) {
            console.log(`🔹 Backup created and compressed: ${filePath}`);
        } else {
            console.log(`🔹 Backup created: ${filePath}`);
        }
        return filePath;
    } catch (error) {
        console.error('❌ Backup failed:', error);
        throw error;
    }
}
