import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logoEmpresa from "../assets/imgs/ChatGPT Image 29 ago 2025, 20_49_53.png"
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
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
                <Link to="/carrito" className="btn btn-outline-light text-white">
                  <i className="bi bi-cart3 me-2"></i>
                  Carrito
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