import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logoEmpresa from "../assets/imgs/ChatGPT Image 29 ago 2025, 20_49_53.png"

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src={logoEmpresa} alt="LVL UP Gamer Logo" className="navbar-logo" />
          <span className="navbar-name">LVL UP Gamer</span>
        </div>
        <div className="navbar-menu">
          <a href="/inicio" className="navbar-link">Inicio</a>
          <a href="/catalogo" className="navbar-link">Categorías de Productos</a>

          <a href="#contacto" className="navbar-link">Contacto</a>
          <a href="#blog" className="navbar-link">Blog</a>
          <a href="#comunidad" className="navbar-link">Comunidad</a>

          {/* Acciones: Auth */}
          <div className="navbar-actions">
            <Link to="/login" className="btn btn-primary text-white">Iniciar Sesión</Link>
            <Link to="/register" className="btn btn-primary text-white">Registrarse</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;