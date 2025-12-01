import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, isApiError } from '../services/api';
import { Usuario } from '../types/Usuario';

interface UsuarioEditForm {
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string;
  user: string;
  region: string;
  comuna: string;
  direccion: string;
  rol?: string;
  password?: string; // opcional para reset
}

const EditarUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<UsuarioEditForm | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errores, setErrores] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const u: Usuario = await api.getUsuarioById(id);
        setForm({
          nombre: u.nombre,
          apellido: u.apellido,
          email: u.email,
          fecha_nacimiento: u.fecha_nacimiento,
          user: u.user,
          region: u.region,
          comuna: u.comuna,
          direccion: u.direccion,
          rol: u.rol,
          password: ''
        });
      } catch (err) {
        setErrores([isApiError(err) ? err.message : 'Error cargando usuario']);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => prev ? { ...prev, [name]: value } : prev);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form || !id) return;
    const nuevosErrores: string[] = [];
    if (!form.nombre) nuevosErrores.push('Nombre requerido');
    if (!form.apellido) nuevosErrores.push('Apellido requerido');
    if (!form.email) nuevosErrores.push('Email requerido');
    if (!form.fecha_nacimiento) nuevosErrores.push('Fecha de nacimiento requerida');
    if (!form.user) nuevosErrores.push('Nombre de usuario requerido');
    if (!form.region) nuevosErrores.push('Región requerida');
    if (!form.comuna) nuevosErrores.push('Comuna requerida');
    if (!form.direccion) nuevosErrores.push('Dirección requerida');
    if (form.password && form.password.length > 0 && form.password.length < 6) nuevosErrores.push('La nueva contraseña debe tener al menos 6 caracteres');
    setErrores(nuevosErrores);
    if (nuevosErrores.length > 0) return;

    try {
      setSaving(true);
      const payload: any = { ...form };
      if (!payload.password) delete payload.password; // si está vacía no se envía
      await api.updateUsuario(id, payload);
      navigate('/usuarios');
    } catch (err) {
      setErrores([isApiError(err) ? err.message : 'Error guardando cambios']);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-4">Cargando usuario...</div>;
  if (!form) return <div className="p-4">No se encontró el usuario.</div>;

  return (
    <div className="p-4">
      <h1 className="mb-3">Editar Usuario</h1>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre*</label>
          <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Apellido*</label>
          <input className="form-control" name="apellido" value={form.apellido} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email*</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Fecha de Nacimiento*</label>
          <input type="date" className="form-control" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Nombre de Usuario*</label>
          <input className="form-control" name="user" value={form.user} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Rol</label>
          <input className="form-control" name="rol" value={form.rol || ''} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Región*</label>
          <input className="form-control" name="region" value={form.region} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Comuna*</label>
          <input className="form-control" name="comuna" value={form.comuna} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Dirección*</label>
          <input className="form-control" name="direccion" value={form.direccion} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Nueva contraseña (opcional)</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} />
        </div>
        <div className="col-12 mt-3">
          <button disabled={saving} className="btn btn-primary me-2" type="submit">{saving ? 'Guardando...' : 'Guardar Cambios'}</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/usuarios')}>Cancelar</button>
        </div>
      </form>
      {errores.length > 0 && (
        <div className="alert alert-danger mt-3">
          {errores.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}
    </div>
  );
};

export default EditarUsuario;
