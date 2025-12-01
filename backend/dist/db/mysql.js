"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = getPool;
exports.testConnection = testConnection;
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = require("mysql2/promise");
dotenv_1.default.config();
let pool;
function getPool() {
    if (!pool) {
        pool = (0, promise_1.createPool)({
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'tienda_lvl_up',
            connectionLimit: 10,
            namedPlaceholders: true
        });
    }
    return pool;
}
async function testConnection() {
    try {
        const p = getPool();
        await p.query('SELECT 1');
        console.log('MySQL conectado correctamente');
    }
    catch (err) {
        console.error('Error conectando a MySQL:', err);
    }
}
