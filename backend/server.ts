import express, { Application } from 'express';
import cors from 'cors';
import productoRoutes from './routes/productoRoutes';
import categoriaRoutes from './routes/categoriaRoutes';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);

// Ruta de salud / prueba
app.get('/api/health', (_req, res) => {
	res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;

