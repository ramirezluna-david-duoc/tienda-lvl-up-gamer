"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productoController_1 = require("../controllers/productoController");
const router = (0, express_1.Router)();
// GET /productos -> todos los productos
router.get('/', productoController_1.getAllProductos);
// GET /productos/search?q=term -> búsqueda
router.get('/search', productoController_1.searchProductos);
// GET /productos/categoria/:categoria -> filtrar por categoría
router.get('/categoria/:categoria', productoController_1.getProductosByCategoria);
// GET /productos/:id -> producto específico
router.get('/:id', productoController_1.getProductoById);
// POST /productos -> crear
router.post('/', productoController_1.createProducto);
// PUT /productos/:id -> actualizar
router.put('/:id', productoController_1.updateProducto);
// DELETE /productos/:id -> eliminar
router.delete('/:id', productoController_1.deleteProducto);
exports.default = router;
