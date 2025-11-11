import mysql from 'mysql2/promise';
import {MySQLConfig} from "../types/mysql";
import logger from "lumilogger";

export async function testConnection(config: MySQLConfig) {
    try {
        const connection = await mysql.createConnection(config);
        await connection.ping();
        logger.log('✅ MySQL connection successful!');
        await connection.end();
        return true;
    } catch (error) {
        logger.error('❌ MySQL connection failed:', error);
        return false;
    }
}
