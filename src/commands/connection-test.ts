import mysql from 'mysql2/promise';

interface MySQLConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

export async function testConnection(config: MySQLConfig) {
    try {
        const connection = await mysql.createConnection(config);
        await connection.ping();
        console.log('✅ MySQL connection successful!');
        await connection.end();
        return true;
    } catch (error) {
        console.error('❌ MySQL connection failed:', error);
        return false;
    }
}
