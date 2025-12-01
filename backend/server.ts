import express, { Application } from 'express';
import cors from 'cors';
import productoRoutes from './routes/productoRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import authRoutes from './routes/authRoutes';
import usuarioRoutes from './routes/usuarioRoutes';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Debug de rutas montadas
console.log('[server] Rutas montadas: /api/productos, /api/categorias, /api/auth, /api/usuarios');


// Ruta de salud / prueba
app.get('/api/health', (_req, res) => {
	res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;

// Observadores de salida y errores para diagnosticar cierre inesperado

