import React, { useEffect, useState } from 'react';
import { api, isApiError } from '../services/api';
import { Link } from 'react-router-dom';

interface Categoria {
  id: number;
  titulo: string;
  imagen?: string;
  link: string;
}

const AdminCategorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [titulo, setTitulo] = useState('');
  const [imagen, setImagen] = useState('');
  const [link, setLink] = useState('#');
  const [loading, setLoading] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [idEditar, setIdEditar] = useState<string>('');

  const load = () => {
    setLoading(true);
    api.getCategorias()
      .then(setCategorias)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const crear = async () => {
    if (!titulo.trim()) return alert('Ingrese un título');
    try {
      await api.createCategoria({ titulo, imagen: imagen || undefined, link: link || '#' });
      setTitulo(''); setImagen(''); setLink('#');
      load();
    } catch (err) {
      if (isApiError(err)) alert(`Error ${err.status}: ${err.message}`); else alert('Error creando categoría');
    }
  };

  const eliminar = async (id: number) => {
    // Usar window.confirm para evitar la regla no-restricted-globals de ESLint
    if (!window.confirm('¿Eliminar categoría?')) return;
    try {
      await api.deleteCategoria(id);
      setCategorias(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      if (isApiError(err)) alert(`Error ${err.status}: ${err.message}`); else alert('Error eliminando categoría');
    }
  };

  // editar función ya reemplazada por formulario dedicado, se elimina para evitar warning ESLint

  return (
    <div className="p-3">
      <h2>Categorías</h2>
      <div className="d-flex gap-2 align-items-end mb-3">
        <div>
          <label className="form-label" htmlFor="idEditar">ID de categoría para editar</label>
          <input id="idEditar" className="form-control" placeholder="Ej: 1" value={idEditar} onChange={e => setIdEditar(e.target.value)} />
        </div>
        <button className="btn btn-warning" onClick={() => {
          if (!idEditar) return alert('Ingrese un ID');
          window.location.href = `/editar-categoria/${encodeURIComponent(idEditar)}`;
        }}>Editar categoría</button>
      </div>
      <div className="bg-light p-3 rounded mb-3">
        <h5>Nueva categoría</h5>
        <div className="row g-2">
          <div className="col-md-4">
            <input className="form-control" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} />
          </div>
          <div className="col-md-4">
            <input className="form-control" placeholder="Imagen (URL opcional)" value={imagen} onChange={e => setImagen(e.target.value)} />
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Link" value={link} onChange={e => setLink(e.target.value)} />
          </div>
          <div className="col-md-1 d-grid">
            <button className="btn btn-primary" onClick={crear}>Crear</button>
          </div>
        </div>
      </div>

      {loading ? <p>Cargando...</p> : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Imagen</th>
              <th>Link</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.titulo}</td>
                <td>{c.imagen}</td>
                <td>{c.link}</td>
                <td className="d-flex gap-2">
                  <button className="btn btn-sm btn-danger" onClick={() => eliminar(c.id)} title="Eliminar">
                    <i className="bi bi-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCategorias;
