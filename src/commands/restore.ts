import { exec } from 'child_process';

interface RestoreOptions {
    host: string;
    user: string;
    password: string;
    database: string;
    backupFile: string;
}

export async function restoreMySQL(options: RestoreOptions) {
    try {
        const cmd = `mysql -h ${options.host} -u ${options.user} -p${options.password} ${options.database} < ${options.backupFile}`;
        await new Promise<void>((resolve, reject) => {
            exec(cmd, (error) => {
                if (error) return reject(error);
                resolve();
            });
        });
        console.log(`🔹 Database restored from: ${options.backupFile}`);
    } catch (error) {
        console.error('❌ Restore failed:', error);
        throw error;
    }
}
