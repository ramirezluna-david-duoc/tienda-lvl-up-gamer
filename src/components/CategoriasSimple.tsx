import React from 'react';
import categoriasData from '../data/categorias.json';
import '../styles/CategoriasSimple.css';
import { Categoria } from '../types/Categoria';

// Mapa de imágenes locales confiables por título
const imageMap: Record<string, string> = {
  'Juegos de Mesa': require('../assets/imgs/productos/Catan/catan.webp'),
  'Accesorios': require('../assets/imgs/productos/Auriculares/w=1500,h=1500,fit=pad.webp'),
  'Consolas': require('../assets/imgs/productos/PlayStation 5/play5.webp'),
  'Computadores': require('../assets/imgs/productos/PC Gamer/w=1500,h=1500,fit=pad_pc.webp'),
  'Sillas Gamers': require('../assets/imgs/productos/Silla/silla.webp'),
  'Mouse': require('../assets/imgs/productos/Mouse/mouse.webp'),
  'Mousepads': require('../assets/imgs/productos/MousePad/D_NQ_NP_711289-MLU70103676213_062023-O_square.png'),
  'Poleras y Polerones': require('../assets/imgs/productos/Polera/polera_azul.png'),
};

const CategoriasSimple: React.FC = () => {
  const categorias = categoriasData as Categoria[];

  const getImageFor = (titulo: string, fallbackUrl?: string): string => {
    if (imageMap[titulo]) return imageMap[titulo];
    if (fallbackUrl) return fallbackUrl;
    return `https://via.placeholder.com/300x200/00d9ff/ffffff?text=${encodeURIComponent(titulo)}`;
  };

  return (
    <section className="categorias-simple-section">
      <div className="categorias-simple-container">
        <h2 className="categorias-simple-title">Categorías</h2>
        <div className="categorias-simple-grid">
          {categorias.map((cat: Categoria) => (
            <a
              key={cat.id}
              href={cat.link}
              className="categoria-simple-card"
            >
              <div className="categoria-simple-image-container">
                <img
                  src={getImageFor(cat.titulo, cat.imagen)}
                  alt={cat.titulo}
                  className="categoria-simple-image"
                />
              </div>
              <div className="categoria-simple-content">
                <h3 className="categoria-simple-titulo">{cat.titulo}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriasSimple;
