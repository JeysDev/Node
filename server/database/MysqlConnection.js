import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const node_js_training = mysql.createPool({
    host: process.env.MYSQL2_HOST,
    port: Number(process.env.MYSQL2_PORT) || 3306,
    user: process.env.MYSQL2_USERNAME,
    password: process.env.MYSQL2_PASSWORD,
    database: process.env.MYSQL2_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    connectTimeout: 10000,
    multipleStatements: false, // Prevent SQL injection via multiple queries (default is false)
    ssl: process.env.MYSQL2_SSL === 'true' ? { rejectUnauthorized: true } : undefined // Use SSL if applicable
});

export {
    node_js_training,
}