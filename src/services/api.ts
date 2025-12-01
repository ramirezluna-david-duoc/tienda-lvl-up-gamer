import type { Producto, Categoria, Usuario } from '../types';

// Permite sobreescribir la URL en entornos CRA usando REACT_APP_API_URL
const API_URL = (process.env.REACT_APP_API_URL as string) || 'http://localhost:5000/api';

interface ApiErrorShape {
  message: string;
  status: number;
  url: string;
  detail?: any;
}

class ApiError extends Error implements ApiErrorShape {
  status: number;
  url: string;
  detail?: any;
  constructor(message: string, status: number, url: string, detail?: any) {
    super(message);
    this.status = status;
    this.url = url;
    this.detail = detail;
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    ...options
  });
  if (!res.ok) {
    let detail: any = undefined;
    try { detail = await res.json(); } catch (_) {}
    const msg = detail?.error || detail?.message || `Error HTTP ${res.status}`;
    throw new ApiError(msg, res.status, url, detail);
  }
  return res.json();
}

// Adaptadores de datos: si en el futuro la API cambia estructura, normalizamos aquí.
function mapProducto(p: any): Producto {
  return {
    id_producto: p.id_producto,
    categoria: p.categoria,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    imagen: p.imagen
  };
}

function mapCategoria(c: any): Categoria {
  return {
    id: c.id,
    titulo: c.titulo,
    imagen: c.imagen,
    link: c.link
  };
}

function mapUsuario(u: any): Usuario {
  return {
    id: u.id,
    rut: u.rut,
    nombre: u.nombre,
    apellido: u.apellido,
    email: u.email,
    fecha_nacimiento: u.fecha_nacimiento,
    user: u.user ?? u.username,
    region: u.region,
    comuna: u.comuna,
    direccion: u.direccion,
    rol: u.rol
  };
}

// API principal (nombres en español) + aliases en inglés para compatibilidad previa
export const api = {
  // --- Auth ---
  login: async (identifier: string, password: string): Promise<{ user: Usuario; token: string }> => {
    const data = await fetchJson<any>(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    return { user: mapUsuario(data.user), token: data.token };
  },
  // --- Productos ---
  getProductos: async (): Promise<Producto[]> => {
    const data = await fetchJson<any[]>(`${API_URL}/productos`);
    return data.map(mapProducto);
  },
  getProductoById: async (id: string): Promise<Producto> => {
    const data = await fetchJson<any>(`${API_URL}/productos/${id}`);
    return mapProducto(data);
  },
  getProductosByCategoria: async (categoria: string): Promise<Producto[]> => {
    const data = await fetchJson<any[]>(`${API_URL}/productos/categoria/${encodeURIComponent(categoria)}`);
    return data.map(mapProducto);
  },
  searchProductos: async (query: string): Promise<Producto[]> => {
    const data = await fetchJson<any[]>(`${API_URL}/productos/search?q=${encodeURIComponent(query)}`);
    return data.map(mapProducto);
  },
  // --- Categorías ---
  getCategorias: async (): Promise<Categoria[]> => {
    const data = await fetchJson<any[]>(`${API_URL}/categorias`);
    return data.map(mapCategoria);
  },
  getCategoriaById: async (id: number): Promise<Categoria> => {
    const data = await fetchJson<any>(`${API_URL}/categorias/${id}`);
    return mapCategoria(data);
  },
  // --- CRUD Productos ---
  createProducto: async (payload: Partial<Producto> & { id_producto: string; precio: number; categoria_id?: number; categoria?: string }): Promise<{ message: string; id_producto: string }> => {
    return fetchJson(`${API_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },
  updateProducto: async (id: string, payload: Partial<Producto> & { categoria_id?: number; categoria?: string }): Promise<{ message: string; id_producto: string }> => {
    return fetchJson(`${API_URL}/productos/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },
  deleteProducto: async (id: string): Promise<{ message: string; id_producto: string }> => {
    return fetchJson(`${API_URL}/productos/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  // --- CRUD Categorías ---
  createCategoria: async (payload: Pick<Categoria, 'titulo'> & Partial<Pick<Categoria, 'imagen' | 'link'>>): Promise<{ message: string; id: number }> => {
    return fetchJson(`${API_URL}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },
  updateCategoria: async (id: number, payload: Partial<Categoria>): Promise<{ message: string; id: number }> => {
    return fetchJson(`${API_URL}/categorias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },
  deleteCategoria: async (id: number): Promise<{ message: string; id: number }> => {
    return fetchJson(`${API_URL}/categorias/${id}`, { method: 'DELETE' });
  },
  // --- Usuarios ---
  getUsuarios: async (): Promise<Usuario[]> => {
    const data = await fetchJson<any[]>(`${API_URL}/usuarios`);
    return data.map(mapUsuario);
  },
  getUsuarioById: async (id: number | string): Promise<Usuario> => {
    const data = await fetchJson<any>(`${API_URL}/usuarios/${id}`);
    return mapUsuario(data);
  },
  getUsuarioByRut: async (rut: string): Promise<Usuario> => {
    const data = await fetchJson<any>(`${API_URL}/usuarios/rut/${encodeURIComponent(rut)}`);
    return mapUsuario(data);
  },
  createUsuario: async (payload: { rut: string; nombre: string; apellido: string; email: string; fecha_nacimiento: string; user: string; region: string; comuna: string; direccion: string; password: string; rol?: string; }): Promise<Usuario> => {
    const data = await fetchJson<any>(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return mapUsuario(data);
  },
  updateUsuario: async (id: number | string, payload: Partial<{ nombre: string; apellido: string; email: string; fecha_nacimiento: string; user: string; region: string; comuna: string; direccion: string; password: string; rol: string; }>): Promise<Usuario> => {
    const data = await fetchJson<any>(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return mapUsuario(data);
  },
  deleteUsuario: async (id: number | string): Promise<{ message: string }> => {
    return fetchJson(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
  },
  // --- Aliases en inglés (compatibilidad con código anterior) ---
  getProducts: async (): Promise<Producto[]> => api.getProductos(),
  getProductById: async (id: string): Promise<Producto> => api.getProductoById(id),
  getProductsByCategory: async (category: string): Promise<Producto[]> => api.getProductosByCategoria(category),
  searchProducts: async (query: string): Promise<Producto[]> => api.searchProductos(query),
  getCategories: async (): Promise<Categoria[]> => api.getCategorias(),
  getCategoryById: async (id: number | string): Promise<Categoria> => api.getCategoriaById(Number(id))
};

// Helper para manejar errores en componentes (opcional)
export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}
