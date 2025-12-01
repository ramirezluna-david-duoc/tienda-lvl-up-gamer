import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, isApiError } from '../services/api';

interface ProductoForm {
  id_producto: string;
  nombre: string;
  descripcion: string;
  precio: number | '';
  categoria_id?: number;
  imagen?: string;
}

interface CategoriaOption { id: number; titulo: string; }

const EditarProducto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductoForm | null>(null);
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [errores, setErrores] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [producto, cats] = await Promise.all([
          api.getProductoById(id as string),
          api.getCategorias()
        ]);
        if (!active) return;
        setForm({
          id_producto: producto.id_producto,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          imagen: producto.imagen,
          // categoria_id se resolverá al enviar; buscamos el id por titulo
          categoria_id: cats.find(c => c.titulo.toLowerCase() === producto.categoria.toLowerCase())?.id
        });
        setCategorias(cats.map(c => ({ id: c.id, titulo: c.titulo })));
      } catch (err) {
        if (isApiError(err)) setErrores([`Error ${err.status}: ${err.message}`]); else setErrores(['Error cargando producto']);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => prev ? {
      ...prev,
      [name]: name === 'precio' ? (value === '' ? '' : Number(value)) : (name === 'categoria_id' ? Number(value) : value)
    } : prev);
  };

  const validar = (data: ProductoForm): string[] => {
    const errs: string[] = [];
    if (!data.nombre.trim()) errs.push('Nombre requerido');
    if (data.precio === '' || (typeof data.precio === 'number' && data.precio < 0)) errs.push('Precio inválido');
    if (!data.categoria_id) errs.push('Categoría requerida');
    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const v = validar(form);
    setErrores(v);
    if (v.length) return;
    setGuardando(true);
    try {
      await api.updateProducto(form.id_producto, {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: form.precio === '' ? 0 : form.precio,
        categoria_id: form.categoria_id,
        imagen: form.imagen
      });
      navigate('/productos');
    } catch (err) {
      if (isApiError(err)) setErrores([`Error ${err.status}: ${err.message}`]); else setErrores(['Error guardando cambios']);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <div className="p-3">Cargando...</div>;
  if (!form) return <div className="p-3">Producto no encontrado</div>;

  return (
    <div className="p-4">
      <h2>Editar Producto</h2>
      <p><small>ID: {form.id_producto}</small></p>
      <form onSubmit={handleSubmit} className="mt-3" noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" className="form-control" value={form.nombre} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="descripcion">Descripción</label>
          <textarea id="descripcion" name="descripcion" className="form-control" value={form.descripcion} onChange={handleChange} rows={3} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="precio">Precio</label>
          <input id="precio" name="precio" type="number" min={0} className="form-control" value={form.precio} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="categoria_id">Categoría</label>
          <select id="categoria_id" name="categoria_id" className="form-select" value={form.categoria_id ?? ''} onChange={handleChange}>
            <option value="">-- Seleccione --</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="imagen">URL Imagen</label>
          <input id="imagen" name="imagen" className="form-control" value={form.imagen ?? ''} onChange={handleChange} />
        </div>
        {errores.length > 0 && <div className="alert alert-danger">
          <ul className="mb-0">
            {errores.map((e,i) => <li key={i}>{e}</li>)}
          </ul>
        </div>}
        <div className="d-flex gap-2">
          <button disabled={guardando} type="submit" className="btn btn-primary">{guardando ? 'Guardando...' : 'Guardar cambios'}</button>
          <Link to="/productos" className="btn btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
};

export default EditarProducto;
