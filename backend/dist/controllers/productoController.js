"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProducto = exports.updateProducto = exports.createProducto = exports.searchProductos = exports.getProductosByCategoria = exports.getProductoById = exports.getAllProductos = void 0;
const mysql_1 = require("../db/mysql");
// Obtener todos los productos desde la BD
const getAllProductos = async (_req, res) => {
    try {
        const pool = (0, mysql_1.getPool)();
        const [rows] = await pool.query(`SELECT p.id_producto, c.titulo AS categoria, p.nombre, p.descripcion, p.precio, p.imagen
			 FROM productos p
			 JOIN categorias c ON p.categoria_id = c.id`);
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error obteniendo productos' });
    }
};
exports.getAllProductos = getAllProductos;
// Obtener un producto por su id_producto
const getProductoById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = (0, mysql_1.getPool)();
        const [rows] = await pool.query(`SELECT p.id_producto, c.titulo AS categoria, p.nombre, p.descripcion, p.precio, p.imagen
			 FROM productos p
			 JOIN categorias c ON p.categoria_id = c.id
			 WHERE p.id_producto = ?`, [id]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error obteniendo producto' });
    }
};
exports.getProductoById = getProductoById;
// Filtrar productos por categoría (titulo de la categoría)
const getProductosByCategoria = async (req, res) => {
    const { categoria } = req.params;
    try {
        const pool = (0, mysql_1.getPool)();
        const [rows] = await pool.query(`SELECT p.id_producto, c.titulo AS categoria, p.nombre, p.descripcion, p.precio, p.imagen
			 FROM productos p
			 JOIN categorias c ON p.categoria_id = c.id
			 WHERE LOWER(c.titulo) = LOWER(?)`, [categoria]);
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error filtrando productos por categoría' });
    }
};
exports.getProductosByCategoria = getProductosByCategoria;
// Buscar productos por término (nombre, descripción o categoría)
const searchProductos = async (req, res) => {
    const { q } = req.query;
    try {
        const pool = (0, mysql_1.getPool)();
        if (!q || typeof q !== 'string') {
            const [rows] = await pool.query(`SELECT p.id_producto, c.titulo AS categoria, p.nombre, p.descripcion, p.precio, p.imagen
				 FROM productos p
				 JOIN categorias c ON p.categoria_id = c.id`);
            res.json(rows);
            return;
        }
        const termino = `%${q}%`;
        const [rows] = await pool.query(`SELECT p.id_producto, c.titulo AS categoria, p.nombre, p.descripcion, p.precio, p.imagen
			 FROM productos p
			 JOIN categorias c ON p.categoria_id = c.id
			 WHERE p.nombre LIKE ? OR p.descripcion LIKE ? OR c.titulo LIKE ?`, [termino, termino, termino]);
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error buscando productos' });
    }
};
exports.searchProductos = searchProductos;
// Crear producto
const createProducto = async (req, res) => {
    const { id_producto, nombre, descripcion, precio, imagen, categoria_id, categoria } = req.body ?? {};
    if (!id_producto || !nombre || !descripcion || typeof precio !== 'number') {
        res.status(400).json({ error: 'Datos inválidos: id_producto, nombre, descripcion y precio son obligatorios' });
        return;
    }
    try {
        const pool = (0, mysql_1.getPool)();
        let catId = categoria_id;
        if (!catId && categoria) {
            const [catRows] = await pool.query('SELECT id FROM categorias WHERE LOWER(titulo) = LOWER(?)', [categoria]);
            if (catRows.length === 0) {
                res.status(400).json({ error: 'Categoría no encontrada' });
                return;
            }
            catId = Number(catRows[0].id);
        }
        if (!catId) {
            res.status(400).json({ error: 'categoria_id o categoria (titulo) es requerido' });
            return;
        }
        await pool.query(`INSERT INTO productos (id_producto, categoria_id, nombre, descripcion, precio, imagen)
				 VALUES (?, ?, ?, ?, ?, ?)`, [id_producto, catId, nombre, descripcion, precio, imagen ?? null]);
        res.status(201).json({ message: 'Producto creado', id_producto });
    }
    catch (err) {
        if (err?.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'id_producto ya existe' });
            return;
        }
        console.error(err);
        res.status(500).json({ error: 'Error creando producto' });
    }
};
exports.createProducto = createProducto;
// Actualizar producto
const updateProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen, categoria_id, categoria } = req.body ?? {};
    if (!nombre && !descripcion && typeof precio !== 'number' && !imagen && !categoria_id && !categoria) {
        res.status(400).json({ error: 'No hay campos para actualizar' });
        return;
    }
    try {
        const pool = (0, mysql_1.getPool)();
        let catId = categoria_id;
        if (!catId && categoria) {
            const [catRows] = await pool.query('SELECT id FROM categorias WHERE LOWER(titulo) = LOWER(?)', [categoria]);
            if (catRows.length === 0) {
                res.status(400).json({ error: 'Categoría no encontrada' });
                return;
            }
            catId = Number(catRows[0].id);
        }
        const fields = [];
        const values = [];
        if (typeof catId === 'number') {
            fields.push('categoria_id = ?');
            values.push(catId);
        }
        if (typeof nombre === 'string') {
            fields.push('nombre = ?');
            values.push(nombre);
        }
        if (typeof descripcion === 'string') {
            fields.push('descripcion = ?');
            values.push(descripcion);
        }
        if (typeof precio === 'number') {
            fields.push('precio = ?');
            values.push(precio);
        }
        if (typeof imagen === 'string' || imagen === null) {
            fields.push('imagen = ?');
            values.push(imagen ?? null);
        }
        if (fields.length === 0) {
            res.status(400).json({ error: 'No hay campos válidos para actualizar' });
            return;
        }
        values.push(id);
        const [result] = await pool.query(`UPDATE productos SET ${fields.join(', ')} WHERE id_producto = ?`, values);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }
        res.json({ message: 'Producto actualizado', id_producto: id });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error actualizando producto' });
    }
};
exports.updateProducto = updateProducto;
// Eliminar producto
const deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = (0, mysql_1.getPool)();
        const [result] = await pool.query('DELETE FROM productos WHERE id_producto = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }
        res.json({ message: 'Producto eliminado', id_producto: id });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error eliminando producto' });
    }
};
exports.deleteProducto = deleteProducto;
