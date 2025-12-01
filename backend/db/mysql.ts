import dotenv from 'dotenv';
import { createPool, Pool } from 'mysql2/promise';

dotenv.config();

let pool: Pool;

export function getPool(): Pool {
  if (!pool) {
    pool = createPool({
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

export async function testConnection(): Promise<void> {
  try {
    const p = getPool();
    await p.query('SELECT 1');
    console.log('MySQL conectado correctamente');
  } catch (err) {
    console.error('Error conectando a MySQL:', err);
  }
}
