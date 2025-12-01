import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import logoEmpresa from "../assets/imgs/ChatGPT Image 29 ago 2025, 20_49_53.png"
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const loggedOutFlash = (location.state as any)?.loggedOut;

  useEffect(() => {
    if (loggedOutFlash) {
      // Limpiar el state para que al navegar no persista el mensaje
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }
  }, [loggedOutFlash]);
  const { totalItems } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/', { state: { loggedOut: true } });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {loggedOutFlash && (
          <div className="alert alert-warning w-100 mb-2" role="alert">
            Sesión cerrada
          </div>
        )}
        <div className="navbar-brand">
          <img src={logoEmpresa} alt="LVL UP Gamer Logo" className="navbar-logo" />
          <span className="navbar-name">LVL UP Gamer</span>
        </div>
        <div className="navbar-menu">
          <a href="/" className="navbar-link">Inicio</a>
          <a href="/catalogo" className="navbar-link">Categorías de Productos</a>

          <a href="#contacto" className="navbar-link">Contacto</a>
          <a href="#blog" className="navbar-link">Blog</a>
          <a href="#comunidad" className="navbar-link">Comunidad</a>

          {/* Acciones: Auth */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <Link to="/perfil" className="btn btn-outline-light text-white">
                  <i className="bi bi-person-circle me-2"></i>
                  Perfil
                </Link>
                <Link to="/carrito" className="btn btn-outline-light text-white position-relative">
                  <i className="bi bi-cart3 me-2"></i>
                  Carrito
                  {totalItems > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <button onClick={handleLogout} className="btn btn-danger text-white">
                  <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary text-white">Iniciar Sesión</Link>
                <Link to="/register" className="btn btn-primary text-white">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;