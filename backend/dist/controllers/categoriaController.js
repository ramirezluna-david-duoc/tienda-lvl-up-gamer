"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriaById = exports.deleteCategoria = exports.updateCategoria = exports.createCategoria = exports.getAllCategorias = void 0;
const mysql_1 = require("../db/mysql");
// Obtener todas las categorías desde la BD
const getAllCategorias = async (_req, res) => {
    try {
        const pool = (0, mysql_1.getPool)();
        const [rows] = await pool.query('SELECT id, titulo, imagen, link FROM categorias ORDER BY id');
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error obteniendo categorías' });
    }
};
exports.getAllCategorias = getAllCategorias;
// Crear categoría
const createCategoria = async (req, res) => {
    const { titulo, imagen, link } = req.body ?? {};
    if (!titulo) {
        res.status(400).json({ error: 'titulo es obligatorio' });
        return;
    }
    try {
        const pool = (0, mysql_1.getPool)();
        const [dup] = await pool.query('SELECT id FROM categorias WHERE LOWER(titulo) = LOWER(?)', [titulo]);
        if (dup.length > 0) {
            res.status(409).json({ error: 'Categoría ya existe' });
            return;
        }
        const [result] = await pool.query('INSERT INTO categorias (titulo, imagen, link) VALUES (?, ?, ?)', [titulo, imagen ?? null, link ?? '#']);
        res.status(201).json({ message: 'Categoría creada', id: result.insertId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creando categoría' });
    }
};
exports.createCategoria = createCategoria;
// Actualizar categoría
const updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { titulo, imagen, link } = req.body ?? {};
    if (!titulo && !imagen && !link) {
        res.status(400).json({ error: 'No hay campos para actualizar' });
        return;
    }
    try {
        const pool = (0, mysql_1.getPool)();
        const fields = [];
        const values = [];
        if (typeof titulo === 'string') {
            fields.push('titulo = ?');
            values.push(titulo);
        }
        if (typeof imagen === 'string' || imagen === null) {
            fields.push('imagen = ?');
            values.push(imagen ?? null);
        }
        if (typeof link === 'string') {
            fields.push('link = ?');
            values.push(link);
        }
        values.push(Number(id));
        const [result] = await pool.query(`UPDATE categorias SET ${fields.join(', ')} WHERE id = ?`, values);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Categoría no encontrada' });
            return;
        }
        res.json({ message: 'Categoría actualizada', id: Number(id) });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error actualizando categoría' });
    }
};
exports.updateCategoria = updateCategoria;
// Eliminar categoría
const deleteCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = (0, mysql_1.getPool)();
        const [result] = await pool.query('DELETE FROM categorias WHERE id = ?', [Number(id)]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Categoría no encontrada' });
            return;
        }
        res.json({ message: 'Categoría eliminada', id: Number(id) });
    }
    catch (err) {
        // Si falla por FK, devolver 409
        if (err?.code === 'ER_ROW_IS_REFERENCED_2' || err?.errno === 1451) {
            res.status(409).json({ error: 'No se puede eliminar: hay productos asociados' });
            return;
        }
        console.error(err);
        res.status(500).json({ error: 'Error eliminando categoría' });
    }
};
exports.deleteCategoria = deleteCategoria;
// Obtener una categoría por su id
const getCategoriaById = async (req, res) => {
    const { id } = req.params;
    const idNum = Number(id);
    if (Number.isNaN(idNum)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        const pool = (0, mysql_1.getPool)();
        const [rows] = await pool.query('SELECT id, titulo, imagen, link FROM categorias WHERE id = ?', [idNum]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Categoría no encontrada' });
            return;
        }
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error obteniendo categoría' });
    }
};
exports.getCategoriaById = getCategoriaById;
