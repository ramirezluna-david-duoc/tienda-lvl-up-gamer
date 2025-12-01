"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const productoRoutes_1 = __importDefault(require("./routes/productoRoutes"));
const categoriaRoutes_1 = __importDefault(require("./routes/categoriaRoutes"));
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rutas principales
app.use('/api/productos', productoRoutes_1.default);
app.use('/api/categorias', categoriaRoutes_1.default);
app.use('/api/usuarios', usuarioRoutes_1.default);
// Ruta de salud / prueba
app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK', message: 'API funcionando correctamente' });
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
exports.default = app;
