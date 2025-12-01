import React, { FormEvent, useState } from 'react';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '../config/security';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';
import logoEmpresa from '../assets/imgs/ChatGPT Image 29 ago 2025, 20_49_53.png';
import { useAuth } from '../context/AuthContext';

const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (value: string): boolean => {
    const normalized = value.trim().toLowerCase();
    return allowedDomains.some((domain) => normalized.endsWith(domain));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let isValid = true;

    if (!trimmedEmail) {
      setEmailError('El correo electrónico es requerido');
      isValid = false;
    } else if (!validateEmail(trimmedEmail)) {
      setEmailError('Solo se permiten correos de: @duoc.cl, @profesor.duoc.cl, @gmail.com');
      isValid = false;
    }

    if (!trimmedPassword) {
      setPasswordError('La contraseña es requerida');
      isValid = false;
    } else if (trimmedPassword.length < MIN_PASSWORD_LENGTH || trimmedPassword.length > MAX_PASSWORD_LENGTH) {
      setPasswordError(`La contraseña debe tener entre ${MIN_PASSWORD_LENGTH} y ${MAX_PASSWORD_LENGTH} caracteres`);
      isValid = false;
    }

    if (!isValid) {
      setGeneralError('Por favor, corrige los errores antes de continuar');
      return;
    }

    // Intentar iniciar sesión contra el backend
    const loginResult = await login(trimmedEmail, trimmedPassword);
    if (loginResult.success) {
      // Redirigir según el rol del usuario
      if (loginResult.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setGeneralError(loginResult.message || 'Credenciales incorrectas');
    }
  };

  return (
    <section className="login-section bg-dark text-white py-5 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="login-card border border-3 border-primary rounded shadow-lg p-4 p-md-5">
              <div className="text-center mb-4">
                <img src={logoEmpresa} alt="Logo Level-Up Gamer" className="img-fluid login-logo mb-3" />
                <h2 className="text-uppercase fw-bold mb-0">Iniciar Sesión</h2>
              </div>

              <form autoComplete="off" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control bg-dark text-white border-secondary"
                    id="email"
                    placeholder="Correo electrónico"
                    maxLength={100}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                  {emailError && (
                    <div className="alert alert-danger mt-2 mb-0" role="alert">
                      {emailError}
                    </div>
                  )}
                  <small className="form-text text-secondary">
                    Solo se permiten: @duoc.cl, @profesor.duoc.cl, @gmail.com
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-white border-secondary"
                    id="password"
                    placeholder="Contraseña"
                    maxLength={MAX_PASSWORD_LENGTH}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  {passwordError && (
                    <div className="alert alert-danger mt-2 mb-0" role="alert">
                      {passwordError}
                    </div>
                  )}
                  <small className="form-text text-secondary">
                    Entre {MIN_PASSWORD_LENGTH} y {MAX_PASSWORD_LENGTH} caracteres
                  </small>
                </div>

                {generalError && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {generalError}
                  </div>
                )}

                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-lg btn-custom-verde">
                    Iniciar Sesión
                  </button>
                </div>

                <div className="text-end mb-3">
                  <a href="#" className="text-white text-decoration-underline small">
                    Olvidé mi contraseña
                  </a>
                </div>

                <hr className="border-secondary" />

                <div className="text-center">
                  <h5 className="mb-3">¿No estás registrado?</h5>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Registrarme
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
