import React from 'react';
import '../styles/Footer.css';
import mediosPago from '../assets/imgs/401x117.jpg';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Primera Columna: Empresa y Redes Sociales */}
        <div className="footer-column">
          <h3 className="footer-title">LVL UP Gamer</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord">
              <i className="fab fa-discord"></i>
            </a>
          </div>
        </div>

        {/* Segunda Columna: Enlaces Rápidos */}
        <div className="footer-column">
          <h3 className="footer-title">Enlaces Rápidos</h3>
          <ul className="footer-links">
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Categorías de Productos</a></li>
            <li><a href="#">Contacto</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Comunidad</a></li>
            <li><a href="#">Nosotros</a></li>
          </ul>
        </div>

        {/* Tercera Columna: Medios de Pago */}
        <div className="footer-column">
          <h3 className="footer-title">Medios de Pago</h3>
          <div className="payment-methods">
            <img 
              src={mediosPago} 
              alt="Medios de pago aceptados" 
              className="payment-image"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;