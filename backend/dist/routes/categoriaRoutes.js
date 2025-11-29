"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoriaController_1 = require("../controllers/categoriaController");
const router = (0, express_1.Router)();
// GET /categorias -> todas las categorías
router.get('/', categoriaController_1.getAllCategorias);
// GET /categorias/:id -> categoría específica
router.get('/:id', categoriaController_1.getCategoriaById);
// Crear categoría
router.post('/', categoriaController_1.createCategoria);
// Actualizar categoría
router.put('/:id', categoriaController_1.updateCategoria);
// Eliminar categoría
router.delete('/:id', categoriaController_1.deleteCategoria);
exports.default = router;
