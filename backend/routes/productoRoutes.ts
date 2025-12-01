import { Router } from 'express';
import {
	getAllProductos,
	getProductoById,
	getProductosByCategoria,
	searchProductos,
	createProducto,
	updateProducto,
	deleteProducto
} from '../controllers/productoController';

const router = Router();

// GET /productos -> todos los productos
router.get('/', getAllProductos);

// GET /productos/search?q=term -> búsqueda
router.get('/search', searchProductos);

// GET /productos/categoria/:categoria -> filtrar por categoría
router.get('/categoria/:categoria', getProductosByCategoria);

// GET /productos/:id -> producto específico
router.get('/:id', getProductoById);

// POST /productos -> crear
router.post('/', createProducto);

// PUT /productos/:id -> actualizar
router.put('/:id', updateProducto);

// DELETE /productos/:id -> eliminar
router.delete('/:id', deleteProducto);

export default router;

