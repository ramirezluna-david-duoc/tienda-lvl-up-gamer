"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsuario = exports.updateUsuario = exports.createUsuario = exports.getUsuarioByRut = exports.getUsuarioById = exports.getAllUsuarios = void 0;
const mysql_1 = require("../db/mysql");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = parseInt(process.env.USER_PWD_SALT_ROUNDS || '10', 10);
// Helper: map DB row to API Usuario
function mapRow(row) {
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
const getAllUsuarios = async (_req, res) => {
    try {
        const pool = (0, mysql_1.getPool)();
        const [rows] = await pool.query(`SELECT id, rut, nombre, apellido, email, DATE_FORMAT(fecha_nacimiento,'%Y-%m-%d') AS fecha_nacimiento, username, region, comuna, direccion, rol, created_at, updated_at FROM usuarios ORDER BY id DESC`);
        const usuarios = rows.map(mapRow);
        res.json(usuarios);
    }
    catch (error) {
        console.error('Error al obtener usuarios', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};
exports.getAllUsuarios = getAllUsuarios;
const getUsuarioById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = (0, mysql_1.getPool)();
        const [rows] = await pool.query(`SELECT id, rut, nombre, apellido, email, DATE_FORMAT(fecha_nacimiento,'%Y-%m-%d') AS fecha_nacimiento, username, region, comuna, direccion, rol, created_at, updated_at FROM usuarios WHERE id = ?`, [id]);
        const list = rows;
        if (list.length === 0)
            return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(mapRow(list[0]));
    }
    catch (error) {
        console.error('Error al obtener usuario', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};
exports.getUsuarioById = getUsuarioById;
const getUsuarioByRut = async (req, res) => {
    const { rut } = req.params;
    try {
        const pool = (0, mysql_1.getPool)();
        const [rows] = await pool.query(`SELECT id, rut, nombre, apellido, email, DATE_FORMAT(fecha_nacimiento,'%Y-%m-%d') AS fecha_nacimiento, username, region, comuna, direccion, rol, created_at, updated_at FROM usuarios WHERE rut = ?`, [rut]);
        const list = rows;
        if (list.length === 0)
            return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(mapRow(list[0]));
    }
    catch (error) {
        console.error('Error al obtener usuario por rut', error);
        res.status(500).json({ error: 'Error al obtener usuario por rut' });
    }
};
exports.getUsuarioByRut = getUsuarioByRut;
const createUsuario = async (req, res) => {
    const { rut, nombre, apellido, email, fecha_nacimiento, user, region, comuna, direccion, password, rol } = req.body;
    if (!rut || !nombre || !apellido || !email || !fecha_nacimiento || !user || !region || !comuna || !direccion || !password) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    try {
        const pool = (0, mysql_1.getPool)();
        // Unicidad rut / email / username
        const [dupRows] = await pool.query(`SELECT rut, email, username FROM usuarios WHERE rut = ? OR email = ? OR username = ?`, [rut, email, user]);
        const dups = dupRows;
        if (dups.length > 0) {
            const conflict = [];
            dups.forEach(r => {
                if (r.rut === rut)
                    conflict.push('rut');
                if (r.email === email)
                    conflict.push('email');
                if (r.username === user)
                    conflict.push('user');
            });
            return res.status(409).json({ error: 'Conflicto de unicidad', fields: conflict });
        }
        const password_hash = bcryptjs_1.default.hashSync(password, SALT_ROUNDS);
        const [result] = await pool.query(`INSERT INTO usuarios (rut, nombre, apellido, email, fecha_nacimiento, username, region, comuna, direccion, rol, password_hash) VALUES (?,?,?,?,?,?,?,?,?,?,?)`, [rut, nombre, apellido, email, fecha_nacimiento, user, region, comuna, direccion, rol || 'user', password_hash]);
        const insertId = result.insertId;
        const [rows] = await pool.query(`SELECT id, rut, nombre, apellido, email, DATE_FORMAT(fecha_nacimiento,'%Y-%m-%d') AS fecha_nacimiento, username, region, comuna, direccion, rol, created_at, updated_at FROM usuarios WHERE id = ?`, [insertId]);
        const usuario = mapRow(rows[0]);
        res.status(201).json(usuario);
    }
    catch (error) {
        console.error('Error al crear usuario', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};
exports.createUsuario = createUsuario;
const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, fecha_nacimiento, user, region, comuna, direccion, password, rol } = req.body;
    try {
        const pool = (0, mysql_1.getPool)();
        // Verificar existencia
        const [existsRows] = await pool.query(`SELECT id FROM usuarios WHERE id = ?`, [id]);
        if (existsRows.length === 0)
            return res.status(404).json({ error: 'Usuario no encontrado' });
        const fields = [];
        const values = [];
        if (nombre) {
            fields.push('nombre = ?');
            values.push(nombre);
        }
        if (apellido) {
            fields.push('apellido = ?');
            values.push(apellido);
        }
        if (email) {
            fields.push('email = ?');
            values.push(email);
        }
        if (fecha_nacimiento) {
            fields.push('fecha_nacimiento = ?');
            values.push(fecha_nacimiento);
        }
        if (user) {
            fields.push('username = ?');
            values.push(user);
        }
        if (region) {
            fields.push('region = ?');
            values.push(region);
        }
        if (comuna) {
            fields.push('comuna = ?');
            values.push(comuna);
        }
        if (direccion) {
            fields.push('direccion = ?');
            values.push(direccion);
        }
        if (rol) {
            fields.push('rol = ?');
            values.push(rol);
        }
        if (password) {
            fields.push('password_hash = ?');
            values.push(bcryptjs_1.default.hashSync(password, SALT_ROUNDS));
        }
        if (fields.length === 0)
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);
        await pool.query(sql, values);
        const [rows] = await pool.query(`SELECT id, rut, nombre, apellido, email, DATE_FORMAT(fecha_nacimiento,'%Y-%m-%d') AS fecha_nacimiento, username, region, comuna, direccion, rol, created_at, updated_at FROM usuarios WHERE id = ?`, [id]);
        const usuario = mapRow(rows[0]);
        res.json(usuario);
    }
    catch (error) {
        console.error('Error al actualizar usuario', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};
exports.updateUsuario = updateUsuario;
const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = (0, mysql_1.getPool)();
        const [rows] = await pool.query(`DELETE FROM usuarios WHERE id = ?`, [id]);
        const result = rows;
        if (result.affectedRows === 0)
            return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado' });
    }
    catch (error) {
        console.error('Error al eliminar usuario', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};
exports.deleteUsuario = deleteUsuario;
