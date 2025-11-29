import { Request, Response } from 'express';
import productoData from '../data/producto.json';
import { Producto } from '../src/types/Producto';

// Cargamos los productos desde el archivo JSON y tipamos
const productos: Producto[] = productoData as Producto[];

// Obtener todos los productos
export const getAllProductos = (req: Request, res: Response): void => {
	res.json(productos);
};

// Obtener un producto por su id_producto
export const getProductoById = (req: Request, res: Response): void => {
	const { id } = req.params; // Se espera que el parámetro en la ruta sea :id
	const producto = productos.find(p => p.id_producto === id);

	if (!producto) {
		res.status(404).json({ error: 'Producto no encontrado' });
		return;
	}

	res.json(producto);
};

// Filtrar productos por categoría (campo categoria)
export const getProductosByCategoria = (req: Request, res: Response): void => {
	const { categoria } = req.params; // Se espera que la ruta sea /productos/categoria/:categoria
	const filtrados = productos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
	res.json(filtrados);
};

// Buscar productos por término (nombre, descripcion o categoria)
export const searchProductos = (req: Request, res: Response): void => {
	const { q } = req.query;

	if (!q || typeof q !== 'string') {
		res.json(productos);
		return;
	}

	const termino = q.toLowerCase();
	const resultados = productos.filter(p =>
		p.nombre.toLowerCase().includes(termino) ||
		p.descripcion.toLowerCase().includes(termino) ||
		p.categoria.toLowerCase().includes(termino)
	);

	res.json(resultados);
};

