import { Router } from 'express';
import { getAllCategorias, getCategoriaById } from '../controllers/categoriaController';

const router = Router();

// GET /categorias -> todas las categorías
router.get('/', getAllCategorias);

// GET /categorias/:id -> categoría específica
router.get('/:id', getCategoriaById);

export default router;

