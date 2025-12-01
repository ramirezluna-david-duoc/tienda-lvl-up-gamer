import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { getPool } from '../db/mysql';

// Obtener todas las categorías desde la BD
export const getAllCategorias = async (_req: Request, res: Response): Promise<void> => {
	try {
		const pool = getPool();
		const [rows] = await pool.query<RowDataPacket[]>(
			'SELECT id, titulo, imagen, link FROM categorias ORDER BY id'
		);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error obteniendo categorías' });
	}
};

	// Crear categoría
	export const createCategoria = async (req: Request, res: Response): Promise<void> => {
		const { titulo, imagen, link } = req.body ?? {};
		if (!titulo) {
			res.status(400).json({ error: 'titulo es obligatorio' });
			return;
		}
		try {
			const pool = getPool();
			const [dup] = await pool.query<RowDataPacket[]>('SELECT id FROM categorias WHERE LOWER(titulo) = LOWER(?)', [titulo]);
			if (dup.length > 0) {
				res.status(409).json({ error: 'Categoría ya existe' });
				return;
			}
			const [result] = await pool.query<any>('INSERT INTO categorias (titulo, imagen, link) VALUES (?, ?, ?)', [titulo, imagen ?? null, link ?? '#']);
			res.status(201).json({ message: 'Categoría creada', id: (result as any).insertId });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: 'Error creando categoría' });
		}
	};

	// Actualizar categoría
	export const updateCategoria = async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		const { titulo, imagen, link } = req.body ?? {};
		if (!titulo && !imagen && !link) {
			res.status(400).json({ error: 'No hay campos para actualizar' });
			return;
		}
		try {
			const pool = getPool();
			const fields: string[] = [];
			const values: any[] = [];
			if (typeof titulo === 'string') { fields.push('titulo = ?'); values.push(titulo); }
			if (typeof imagen === 'string' || imagen === null) { fields.push('imagen = ?'); values.push(imagen ?? null); }
			if (typeof link === 'string') { fields.push('link = ?'); values.push(link); }
			values.push(Number(id));
			const [result] = await pool.query<any>(`UPDATE categorias SET ${fields.join(', ')} WHERE id = ?`, values);
			if ((result as any).affectedRows === 0) {
				res.status(404).json({ error: 'Categoría no encontrada' });
				return;
			}
			res.json({ message: 'Categoría actualizada', id: Number(id) });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: 'Error actualizando categoría' });
		}
	};

	// Eliminar categoría
	export const deleteCategoria = async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		try {
			const pool = getPool();
			const [result] = await pool.query<any>('DELETE FROM categorias WHERE id = ?', [Number(id)]);
			if ((result as any).affectedRows === 0) {
				res.status(404).json({ error: 'Categoría no encontrada' });
				return;
			}
			res.json({ message: 'Categoría eliminada', id: Number(id) });
		} catch (err: any) {
			// Si falla por FK, devolver 409
			if (err?.code === 'ER_ROW_IS_REFERENCED_2' || err?.errno === 1451) {
				res.status(409).json({ error: 'No se puede eliminar: hay productos asociados' });
				return;
			}
			console.error(err);
			res.status(500).json({ error: 'Error eliminando categoría' });
		}
	};

// Obtener una categoría por su id
export const getCategoriaById = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;
	const idNum = Number(id);
	if (Number.isNaN(idNum)) {
		res.status(400).json({ error: 'ID inválido' });
		return;
	}
	try {
		const pool = getPool();
		const [rows] = await pool.query<RowDataPacket[]>(
			'SELECT id, titulo, imagen, link FROM categorias WHERE id = ?', [idNum]
		);
		if (rows.length === 0) {
			res.status(404).json({ error: 'Categoría no encontrada' });
			return;
		}
		res.json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error obteniendo categoría' });
	}
};

