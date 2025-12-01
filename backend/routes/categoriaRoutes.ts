import { Router } from 'express';
import { getAllCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria } from '../controllers/categoriaController';

const router = Router();

// GET /categorias -> todas las categorías
router.get('/', getAllCategorias);

// GET /categorias/:id -> categoría específica
router.get('/:id', getCategoriaById);

// Crear categoría
router.post('/', createCategoria);

// Actualizar categoría
router.put('/:id', updateCategoria);

// Eliminar categoría
router.delete('/:id', deleteCategoria);

export default router;

