import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { v4 as uuidv4 } from "uuid";

interface UsuarioForm {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string;
  user: string;
  region: string;
  comuna: string;
  direccion: string;
}

const NuevoUsuario: React.FC = () => {
  const [form, setForm] = useState<UsuarioForm>({
    rut: "",
    nombre: "",
    apellido: "",
    email: "",
    fecha_nacimiento: "",
    user: "",
    region: "",
    comuna: "",
    direccion: "",
  });

  const [errores, setErrores] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validarRut = (rut: string) => {
    // Implementar validación de RUT chileno
    const rutLimpio = rut.replace(/[^0-9kK]/g, "");
    if (rutLimpio.length < 8) return false;
    return true; // Simplificado por ahora
  };

  const validarEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nuevosErrores: string[] = [];

    if (!validarRut(form.rut)) {
      nuevosErrores.push("El RUT ingresado no es válido");
    }
    if (!form.nombre) nuevosErrores.push("El nombre es obligatorio");
    if (!form.apellido) nuevosErrores.push("El apellido es obligatorio");
    if (!form.email || !validarEmail(form.email)) {
      nuevosErrores.push("El email ingresado no es válido");
    }
    if (!form.fecha_nacimiento)
      nuevosErrores.push("La fecha de nacimiento es obligatoria");
    if (!form.user) nuevosErrores.push("El nombre de usuario es obligatorio");
    if (!form.region) nuevosErrores.push("La región es obligatoria");
    if (!form.comuna) nuevosErrores.push("La comuna es obligatoria");
    if (!form.direccion) nuevosErrores.push("La dirección es obligatoria");

    setErrores(nuevosErrores);

    if (nuevosErrores.length === 0) {
      const usuariosGuardados = localStorage.getItem("usuarios");
      const lista = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

      // Verificar si el RUT ya existe
      if (lista.some((u: UsuarioForm) => u.rut === form.rut)) {
        setErrores(["Ya existe un usuario con este RUT"]);
        return;
      }

      lista.push({
        id: uuidv4(),
        ...form,
      });

      localStorage.setItem("usuarios", JSON.stringify(lista));
      navigate("/usuarios");
    }
  };

  return (
    <div className="d-flex">
      <div className="content flex-grow-1 p-4">
        <div className="topbar d-flex justify-content-between align-items-center mb-3">
          <h1>Agregar nuevo usuario</h1>
          <i className="bi bi-bell-fill"></i>
        </div>

        <form onSubmit={handleSubmit} noValidate className="needs-validation">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="rut" className="form-label">
                RUT*
              </label>
              <input
                type="text"
                id="rut"
                name="rut"
                className="form-control"
                placeholder="12.345.678-9"
                value={form.rut}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="user" className="form-label">
                Nombre de usuario*
              </label>
              <input
                type="text"
                id="user"
                name="user"
                className="form-control"
                placeholder="Nombre de usuario"
                value={form.user}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="nombre" className="form-label">
                Nombre*
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="form-control"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="apellido" className="form-label">
                Apellido*
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                className="form-control"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="email" className="form-label">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="fecha_nacimiento" className="form-label">
                Fecha de nacimiento*
              </label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                className="form-control"
                value={form.fecha_nacimiento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="region" className="form-label">
                Región*
              </label>
              <select
                id="region"
                name="region"
                className="form-select"
                value={form.region}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una región</option>
                <option value="Metropolitana">Región Metropolitana</option>
                <option value="Valparaíso">Región de Valparaíso</option>
                {/* Agregar más regiones según necesidad */}
              </select>
            </div>

            <div className="col-md-4">
              <label htmlFor="comuna" className="form-label">
                Comuna*
              </label>
              <select
                id="comuna"
                name="comuna"
                className="form-select"
                value={form.comuna}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una comuna</option>
                <option value="Santiago">Santiago</option>
                <option value="Providencia">Providencia</option>
                {/* Agregar más comunas según necesidad */}
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="direccion" className="form-label">
                Dirección*
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                className="form-control"
                placeholder="Calle, número, depto"
                value={form.direccion}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary me-2">
              Agregar Usuario
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/usuarios")}
            >
              Cancelar
            </button>
          </div>
        </form>

        {errores.length > 0 && (
          <div className="alert alert-danger mt-3">
            {errores.map((err, idx) => (
              <p key={idx} className="mb-0">
                {err}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NuevoUsuario;
