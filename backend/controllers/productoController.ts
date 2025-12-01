import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { getPool } from '../db/mysql';

// Obtener todos los productos desde la BD
export const getAllProductos = async (_req: Request, res: Response): Promise<void> => {
	try {
		const pool = getPool();
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT p.id_producto, c.titulo AS categoria, p.nombre, p.descripcion, p.precio, p.imagen
			 FROM productos p
			 JOIN categorias c ON p.categoria_id = c.id`
		);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error obteniendo productos' });
	}
};

// Obtener un producto por su id_producto
export const getProductoById = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;
	try {
		const pool = getPool();
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT p.id_producto, c.titulo AS categoria, p.nombre, p.descripcion, p.precio, p.imagen
			 FROM productos p
			 JOIN categorias c ON p.categoria_id = c.id
			 WHERE p.id_producto = ?`, [id]
		);
		if (rows.length === 0) {
			res.status(404).json({ error: 'Producto no encontrado' });
			return;
		}
		res.json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error obteniendo producto' });
	}
};

// Filtrar productos por categoría (titulo de la categoría)
export const getProductosByCategoria = async (req: Request, res: Response): Promise<void> => {
	const { categoria } = req.params;
	try {
		const pool = getPool();
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT p.id_producto, c.titulo AS categoria, p.nombre, p.descripcion, p.precio, p.imagen
			 FROM productos p
			 JOIN categorias c ON p.categoria_id = c.id
			 WHERE LOWER(c.titulo) = LOWER(?)`, [categoria]
		);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error filtrando productos por categoría' });
	}
};

// Buscar productos por término (nombre, descripción o categoría)
export const searchProductos = async (req: Request, res: Response): Promise<void> => {
	const { q } = req.query;
	try {
		const pool = getPool();
		if (!q || typeof q !== 'string') {
			const [rows] = await pool.query<RowDataPacket[]>(
				`SELECT p.id_producto, c.titulo AS categoria, p.nombre, p.descripcion, p.precio, p.imagen
				 FROM productos p
				 JOIN categorias c ON p.categoria_id = c.id`
			);
			res.json(rows);
			return;
		}
		const termino = `%${q}%`;
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT p.id_producto, c.titulo AS categoria, p.nombre, p.descripcion, p.precio, p.imagen
			 FROM productos p
			 JOIN categorias c ON p.categoria_id = c.id
			 WHERE p.nombre LIKE ? OR p.descripcion LIKE ? OR c.titulo LIKE ?`,
			[termino, termino, termino]
		);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error buscando productos' });
	}
};

	// Crear producto
	export const createProducto = async (req: Request, res: Response): Promise<void> => {
		const { id_producto, nombre, descripcion, precio, imagen, categoria_id, categoria } = req.body ?? {};
		if (!id_producto || !nombre || !descripcion || typeof precio !== 'number') {
			res.status(400).json({ error: 'Datos inválidos: id_producto, nombre, descripcion y precio son obligatorios' });
			return;
		}
		try {
			const pool = getPool();
			let catId = categoria_id as number | undefined;
			if (!catId && categoria) {
				const [catRows] = await pool.query<RowDataPacket[]>('SELECT id FROM categorias WHERE LOWER(titulo) = LOWER(?)', [categoria]);
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
			await pool.query(
				`INSERT INTO productos (id_producto, categoria_id, nombre, descripcion, precio, imagen)
				 VALUES (?, ?, ?, ?, ?, ?)`,
				[id_producto, catId, nombre, descripcion, precio, imagen ?? null]
			);
			res.status(201).json({ message: 'Producto creado', id_producto });
		} catch (err: any) {
			if (err?.code === 'ER_DUP_ENTRY') {
				res.status(409).json({ error: 'id_producto ya existe' });
				return;
			}
			console.error(err);
			res.status(500).json({ error: 'Error creando producto' });
		}
	};

	// Actualizar producto
	export const updateProducto = async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		const { nombre, descripcion, precio, imagen, categoria_id, categoria } = req.body ?? {};
		if (!nombre && !descripcion && typeof precio !== 'number' && !imagen && !categoria_id && !categoria) {
			res.status(400).json({ error: 'No hay campos para actualizar' });
			return;
		}
		try {
			const pool = getPool();
			let catId = categoria_id as number | undefined;
			if (!catId && categoria) {
				const [catRows] = await pool.query<RowDataPacket[]>('SELECT id FROM categorias WHERE LOWER(titulo) = LOWER(?)', [categoria]);
				if (catRows.length === 0) {
					res.status(400).json({ error: 'Categoría no encontrada' });
					return;
				}
				catId = Number(catRows[0].id);
			}
			const fields: string[] = [];
			const values: any[] = [];
			if (typeof catId === 'number') { fields.push('categoria_id = ?'); values.push(catId); }
			if (typeof nombre === 'string') { fields.push('nombre = ?'); values.push(nombre); }
			if (typeof descripcion === 'string') { fields.push('descripcion = ?'); values.push(descripcion); }
			if (typeof precio === 'number') { fields.push('precio = ?'); values.push(precio); }
			if (typeof imagen === 'string' || imagen === null) { fields.push('imagen = ?'); values.push(imagen ?? null); }
			if (fields.length === 0) {
				res.status(400).json({ error: 'No hay campos válidos para actualizar' });
				return;
			}
			values.push(id);
			const [result] = await pool.query<any>(`UPDATE productos SET ${fields.join(', ')} WHERE id_producto = ?`, values);
			if ((result as any).affectedRows === 0) {
				res.status(404).json({ error: 'Producto no encontrado' });
				return;
			}
			res.json({ message: 'Producto actualizado', id_producto: id });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: 'Error actualizando producto' });
		}
	};

	// Eliminar producto
	export const deleteProducto = async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		try {
			const pool = getPool();
			const [result] = await pool.query<any>('DELETE FROM productos WHERE id_producto = ?', [id]);
			if ((result as any).affectedRows === 0) {
				res.status(404).json({ error: 'Producto no encontrado' });
				return;
			}
			res.json({ message: 'Producto eliminado', id_producto: id });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: 'Error eliminando producto' });
		}
	};

