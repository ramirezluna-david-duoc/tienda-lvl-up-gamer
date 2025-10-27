import React from 'react';
import '../styles/Hero.css';
import logoEmpresa from "./"

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenido a Level-Up Gamer</h1>
          <p className="hero-description">
            ¡Bienvenido a la tienda gamer más completa! Encuentra consolas, 
            accesorios, computadores, juegos de mesa y mucho más. Vive la mejor 
            experiencia gamer con productos de calidad, atención personalizada y una 
            comunidad apasionada.
          </p>
        </div>
        <div className="hero-image">
          <img 
            src="../assets/imgs/ChatGPT Image 29 ago 2025, 20_49_53.png" 
            alt="Gaming Setup" 
            className="hero-img"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;