import { Request, Response } from 'express';
import { getPool } from '../db/mysql';
import bcrypt from 'bcryptjs';

function mapRow(row: any) {
  return {
    id: row.id,
    rut: row.rut,
    nombre: row.nombre,
    apellido: row.apellido,
    email: row.email,
    fecha_nacimiento: row.fecha_nacimiento,
    user: row.username,
    region: row.region,
    comuna: row.comuna,
    direccion: row.direccion,
    rol: row.rol,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// POST /api/auth/login
// Accepts { identifier: string, password: string } where identifier can be email or username
export const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body as { identifier: string; password: string };
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Faltan credenciales' });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT id, rut, nombre, apellido, email, DATE_FORMAT(fecha_nacimiento,'%Y-%m-%d') AS fecha_nacimiento, username, region, comuna, direccion, rol, password_hash, created_at, updated_at
       FROM usuarios
       WHERE email = ? OR username = ?
       LIMIT 1`,
      [identifier, identifier]
    );

    const list = rows as any[];
    if (list.length === 0) {
      return res.status(401).json({ error: 'Correo/Usuario no encontrado' });
    }
    const userRow = list[0];
    const isValid = bcrypt.compareSync(password, userRow.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const user = mapRow(userRow);
    // Para simplicidad, devolvemos un token opaco generado en el servidor (no JWT). En producción usar JWT.
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    return res.json({ user, token });
  } catch (error) {
    console.error('Error en login', error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
