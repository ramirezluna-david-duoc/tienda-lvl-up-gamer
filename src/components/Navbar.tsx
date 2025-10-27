import React, { useState } from 'react';
import '../styles/Navbar.css';
import logo from '../logo.svg';

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src={logo} alt="LVL UP Gamer Logo" className="navbar-logo" />
          <span className="navbar-name">LVL UP Gamer</span>
        </div>
        <div className="navbar-menu">
          <a href="#inicio" className="navbar-link">Inicio</a>
          
          <div 
            className="navbar-dropdown"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={closeDropdown}
          >
            <button 
              className="navbar-link navbar-dropdown-toggle"
              onClick={toggleDropdown}
            >
              Categorías de Productos
              <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
            </button>
            
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <a href="#todas-categorias" className="dropdown-item">Todas las Categorías</a>
                <a href="#juegos-mesa" className="dropdown-item">Juegos de Mesa</a>
                <a href="#accesorios" className="dropdown-item">Accesorios</a>
                <a href="#consolas" className="dropdown-item">Consolas</a>
                <a href="#computadores" className="dropdown-item">Computadores</a>
                <a href="#sillas-gamers" className="dropdown-item">Sillas Gamers</a>
                <a href="#mouse" className="dropdown-item">Mouse</a>
                <a href="#mousepads" className="dropdown-item">Mousepads</a>
                <a href="#poleras-polerones" className="dropdown-item">Poleras y Polerones</a>
              </div>
            )}
          </div>

          <a href="#contacto" className="navbar-link">Contacto</a>
          <a href="#blog" className="navbar-link">Blog</a>
          <a href="#comunidad" className="navbar-link">Comunidad</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;