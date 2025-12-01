import { Router } from 'express';
import { getAllUsuarios, getUsuarioById, getUsuarioByRut, createUsuario, updateUsuario, deleteUsuario } from '../controllers/usuarioController';

const router = Router();

console.log('[usuarioRoutes] Cargando rutas de usuarios');

// Ruta base: lista de usuarios
router.get('/', getAllUsuarios);
// Ruta por rut debe ir antes que :id para evitar captura por comodín
router.get('/rut/:rut', getUsuarioByRut);
router.get('/:id', getUsuarioById);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

// Debug opcional para inspeccionar que el router esté montado
router.get('/__debug', (_req, res) => {
	res.json({ status: 'ok', rutas: ['GET /', 'GET /rut/:rut', 'GET /:id', 'POST /', 'PUT /:id', 'DELETE /:id'] });
});

export default router;
