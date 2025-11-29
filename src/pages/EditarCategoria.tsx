import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, isApiError } from '../services/api';

interface CategoriaForm { id: number; titulo: string; imagen?: string; link: string; }

const EditarCategoria: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<CategoriaForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [errores, setErrores] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const cat = await api.getCategoriaById(Number(id));
        if (!active) return;
        setForm({ id: cat.id, titulo: cat.titulo, imagen: cat.imagen, link: cat.link });
      } catch (err) {
        if (isApiError(err)) setErrores([`Error ${err.status}: ${err.message}`]); else setErrores(['Error cargando categoría']);
      } finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const validar = (data: CategoriaForm): string[] => {
    const errs: string[] = [];
    if (!data.titulo.trim()) errs.push('Título requerido');
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
      await api.updateCategoria(form.id, { titulo: form.titulo, imagen: form.imagen, link: form.link });
      navigate('/categorias');
    } catch (err) {
      if (isApiError(err)) setErrores([`Error ${err.status}: ${err.message}`]); else setErrores(['Error guardando cambios']);
    } finally { setGuardando(false); }
  };

  if (loading) return <div className="p-3">Cargando...</div>;
  if (!form) return <div className="p-3">Categoría no encontrada</div>;

  return (
    <div className="p-4">
      <h2>Editar Categoría</h2>
      <p><small>ID: {form.id}</small></p>
      <form onSubmit={handleSubmit} className="mt-3" noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="titulo">Título</label>
          <input id="titulo" name="titulo" className="form-control" value={form.titulo} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="imagen">URL Imagen</label>
          <input id="imagen" name="imagen" className="form-control" value={form.imagen ?? ''} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="link">Link</label>
          <input id="link" name="link" className="form-control" value={form.link} onChange={handleChange} />
        </div>
        {errores.length > 0 && <div className="alert alert-danger"><ul className="mb-0">{errores.map((e,i) => <li key={i}>{e}</li>)}</ul></div>}
        <div className="d-flex gap-2">
          <button disabled={guardando} type="submit" className="btn btn-primary">{guardando ? 'Guardando...' : 'Guardar cambios'}</button>
          <Link to="/categorias" className="btn btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
};

export default EditarCategoria;
