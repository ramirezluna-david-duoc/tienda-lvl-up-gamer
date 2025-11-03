import React, { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/RegisterForm.css';
import logoEmpresa from '../assets/imgs/ChatGPT Image 29 ago 2025, 20_49_53.png';

const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];

const regionComunas: Record<string, string[]> = {
  'Arica y Parinacota': ['Arica', 'Putre', 'Camarones', 'General Lagos'],
  Tarapacá: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica'],
  Antofagasta: ['Antofagasta', 'Calama', 'Mejillones', 'Taltal'],
  Atacama: ['Copiapó', 'Caldera', 'Vallenar', 'Chañaral'],
  Coquimbo: ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel'],
  'Valparaíso': ['Valparaíso', 'Viña del Mar', 'San Antonio', 'Quillota'],
  'Metropolitana de Santiago': ['Santiago', 'Puente Alto', 'Vitacura', 'Maipú'],
  "Libertador General Bernardo O'Higgins": ['Rancagua', 'Machalí', 'San Fernando', 'Pichilemu'],
  Maule: ['Talca', 'Curicó', 'Linares', 'Cauquenes'],
  'Ñuble': ['Chillán', 'Bulnes', 'Quillón', 'Yungay'],
  'Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles', 'Coronel'],
  'La Araucanía': ['Temuco', 'Padre Las Casas', 'Angol', 'Villarrica'],
  'Los Ríos': ['Valdivia', 'Panguipulli', 'La Unión', 'Futrono'],
  'Los Lagos': ['Puerto Montt', 'Puerto Varas', 'Osorno', 'Castro'],
  "Aysén del General Carlos Ibáñez del Campo": ['Coyhaique', 'Puerto Aysén', 'Chile Chico', 'Cochrane'],
  'Magallanes y de la Antártica Chilena': ['Punta Arenas', 'Puerto Natales', 'Porvenir', 'Cabo de Hornos']
};

type FormFields = {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
  telefono: string;
  region: string;
  comuna: string;
  direccion: string;
  referido: string;
  terminos: boolean;
};

type FormErrors = Partial<Record<keyof FormFields | 'general', string>>;

const initialFields: FormFields = {
  nombre: '',
  apellido: '',
  correo: '',
  contrasena: '',
  confirmarContrasena: '',
  telefono: '',
  region: '',
  comuna: '',
  direccion: '',
  referido: '',
  terminos: false
};

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormFields>(initialFields);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const comunasDisponibles = useMemo(
    () => (formData.region ? regionComunas[formData.region] ?? [] : []),
    [formData.region]
  );

  const validateEmail = (value: string) => {
    const normalized = value.trim().toLowerCase();
    return allowedDomains.some((domain) => normalized.endsWith(domain));
  };

  const validateTelefono = (value: string) => {
    if (!value) return true;
    const pattern = /^[0-9+\-()\s]{7,20}$/;
    return pattern.test(value.trim());
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;

    if (type === 'checkbox') {
      const checkbox = event.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checkbox.checked }));
      return;
    }

    if (name === 'region') {
      setFormData((prev) => ({ ...prev, region: value, comuna: '' }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: FormErrors = {};
    const trimmedNombre = formData.nombre.trim();
    const trimmedApellido = formData.apellido.trim();
    const trimmedCorreo = formData.correo.trim();
    const trimmedDireccion = formData.direccion.trim();
    const trimmedTelefono = formData.telefono.trim();

    if (!trimmedNombre) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!trimmedApellido) {
      newErrors.apellido = 'El apellido es obligatorio';
    }

    if (!trimmedCorreo) {
      newErrors.correo = 'El correo es obligatorio';
    } else if (!validateEmail(trimmedCorreo)) {
      newErrors.correo = 'Solo se permiten correos de: @duoc.cl, @profesor.duoc.cl, @gmail.com';
    }

    if (!formData.contrasena) {
      newErrors.contrasena = 'La contraseña es obligatoria';
    } else if (formData.contrasena.length < 6 || formData.contrasena.length > 20) {
      newErrors.contrasena = 'La contraseña debe tener entre 6 y 20 caracteres';
    }

    if (!formData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Debes confirmar tu contraseña';
    } else if (formData.confirmarContrasena !== formData.contrasena) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    if (!trimmedDireccion) {
      newErrors.direccion = 'La dirección es obligatoria';
    } else if (trimmedDireccion.length > 300) {
      newErrors.direccion = 'La dirección no puede superar los 300 caracteres';
    }

    if (!formData.region) {
      newErrors.region = 'Selecciona una región';
    }

    if (!formData.comuna) {
      newErrors.comuna = 'Selecciona una comuna';
    }

    if (!validateTelefono(trimmedTelefono)) {
      newErrors.telefono = 'Ingresa un teléfono válido (solo números, espacios y signos + - ( ) )';
    }

    if (!formData.terminos) {
      newErrors.terminos = 'Debes aceptar los términos y condiciones';
    }

    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      newErrors.general = 'Por favor corrige los errores antes de continuar';
      setErrors(newErrors);
      setSuccessMessage('');
      return;
    }

    setErrors({});
    setSuccessMessage('Registro enviado correctamente (simulación)');

    console.log('Datos de registro (simulación):', {
      ...formData,
      contrasena: '[oculta]',
      confirmarContrasena: undefined
    });
  };

  return (
    <section className="register-section bg-dark text-white py-5 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-9">
            <div className="register-card border border-3 border-primary rounded shadow-lg p-4 p-md-5">
              <div className="text-center mb-4">
                <img src={logoEmpresa} alt="Logo Level-Up Gamer" className="img-fluid register-logo mb-3" />
                <h2 className="text-uppercase fw-bold mb-0">Registro</h2>
              </div>

              {errors.general && (
                <div className="alert alert-danger" role="alert">
                  {errors.general}
                </div>
              )}

              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

              <form id="form-registro" autoComplete="off" onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-12 col-lg-6">
                    <div className="mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre</label>
                      <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Nombre"
                        maxLength={50}
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                      {errors.nombre && (
                        <div className="alert alert-danger mt-2 mb-0" role="alert">
                          {errors.nombre}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="apellido" className="form-label">Apellido</label>
                      <input
                        id="apellido"
                        name="apellido"
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Apellido"
                        maxLength={100}
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                      />
                      {errors.apellido && (
                        <div className="alert alert-danger mt-2 mb-0" role="alert">
                          {errors.apellido}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="correo" className="form-label">Correo</label>
                      <input
                        id="correo"
                        name="correo"
                        type="email"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Correo"
                        maxLength={100}
                        value={formData.correo}
                        onChange={handleChange}
                        required
                      />
                      {errors.correo && (
                        <div className="alert alert-danger mt-2 mb-0" role="alert">
                          {errors.correo}
                        </div>
                      )}
                      <small className="form-text text-secondary">
                        Solo se permiten: @duoc.cl, @profesor.duoc.cl, @gmail.com
                      </small>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="contrasena" className="form-label">Contraseña</label>
                      <input
                        id="contrasena"
                        name="contrasena"
                        type="password"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Contraseña"
                        value={formData.contrasena}
                        onChange={handleChange}
                        required
                      />
                      {errors.contrasena && (
                        <div className="alert alert-danger mt-2 mb-0" role="alert">
                          {errors.contrasena}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="confirmarContrasena" className="form-label">Confirmar Contraseña</label>
                      <input
                        id="confirmarContrasena"
                        name="confirmarContrasena"
                        type="password"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Confirmar Contraseña"
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                        required
                      />
                      {errors.confirmarContrasena && (
                        <div className="alert alert-danger mt-2 mb-0" role="alert">
                          {errors.confirmarContrasena}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="telefono" className="form-label">
                        Teléfono <span className="text-secondary">(opcional)</span>
                      </label>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                      />
                      {errors.telefono && (
                        <div className="alert alert-danger mt-2 mb-0" role="alert">
                          {errors.telefono}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="mb-3">
                      <label htmlFor="region" className="form-label">Región</label>
                      <select
                        id="region"
                        name="region"
                        className="form-select bg-dark text-white border-secondary"
                        value={formData.region}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Selecciona una región
                        </option>
                        {Object.keys(regionComunas).map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                      {errors.region && (
                        <div className="alert alert-danger mt-2 mb-0" role="alert">
                          {errors.region}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="comuna" className="form-label">Comuna</label>
                      <select
                        id="comuna"
                        name="comuna"
                        className="form-select bg-dark text-white border-secondary"
                        value={formData.comuna}
                        onChange={handleChange}
                        disabled={!formData.region}
                        required
                      >
                        <option value="" disabled>
                          {formData.region ? 'Selecciona una comuna' : 'Selecciona primero una región'}
                        </option>
                        {comunasDisponibles.map((comuna) => (
                          <option key={comuna} value={comuna}>
                            {comuna}
                          </option>
                        ))}
                      </select>
                      {errors.comuna && (
                        <div className="alert alert-danger mt-2 mb-0" role="alert">
                          {errors.comuna}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="direccion" className="form-label">Dirección</label>
                      <textarea
                        id="direccion"
                        name="direccion"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Ingresa tu dirección completa"
                        maxLength={300}
                        rows={3}
                        value={formData.direccion}
                        onChange={handleChange}
                        required
                      />
                      {errors.direccion && (
                        <div className="alert alert-danger mt-2 mb-0" role="alert">
                          {errors.direccion}
                        </div>
                      )}
                      <small className="form-text text-secondary">Máximo 300 caracteres</small>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="referido" className="form-label">
                        Código de Referido <span className="text-secondary">(opcional)</span>
                      </label>
                      <input
                        id="referido"
                        name="referido"
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Código de Referido"
                        value={formData.referido}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="terminos"
                        name="terminos"
                        checked={formData.terminos}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-check-label" htmlFor="terminos">
                        Acepto los
                        {' '}
                        <a href="#" className="text-decoration-underline text-white">
                          Términos y Condiciones
                        </a>
                      </label>
                      {errors.terminos && (
                        <div className="alert alert-danger mt-2 mb-0" role="alert">
                          {errors.terminos}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-custom-verde px-5 py-2">
                    Confirmar Registro
                  </button>
                  <div className="mt-3">
                    <Link to="/" className="text-white text-decoration-underline">
                      Volver al inicio
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
