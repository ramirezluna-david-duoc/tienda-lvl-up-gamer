import { Request, Response } from 'express';
import categoriasData from '../data/categorias.json';
import { Categoria } from '../src/types/Categoria';

// Cargamos y tipamos las categorías
const categorias: Categoria[] = categoriasData as Categoria[];

// Obtener todas las categorías
export const getAllCategorias = (req: Request, res: Response): void => {
	res.json(categorias);
};

// Obtener una categoría por su id (numérico)
export const getCategoriaById = (req: Request, res: Response): void => {
	const { id } = req.params; // :id en la ruta
	const idNum = Number(id);
	if (Number.isNaN(idNum)) {
		res.status(400).json({ error: 'ID inválido' });
		return;
	}
	const categoria = categorias.find(c => c.id === idNum);
	if (!categoria) {
		res.status(404).json({ error: 'Categoría no encontrada' });
		return;
	}
	res.json(categoria);
};

