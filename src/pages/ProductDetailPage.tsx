import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductDetailComponent from '../components/ProductDetail';
import productosData from '../data/producto.json';
import { Producto } from '../types/Producto';
import { ProductDetail, ProductSpecification } from '../types/ProductDetail';

const rawProducts = productosData as Producto[];

const getSpecificationsForProduct = (product: Producto): ProductSpecification[] => {
  const specs: ProductSpecification[] = [];

  switch (product.categoria) {
    case 'Consolas':
      if (product.id_producto === 'CO001') {
        specs.push(
          { label: 'Almacenamiento', value: 'SSD de 1TB' },
          { label: 'Procesador (CPU)', value: 'AMD Ryzen 8 núcleos' },
          { label: 'Tarjeta Gráfica (GPU)', value: 'AMD Radeon' },
          { label: 'Memoria RAM', value: '16GB' },
          { label: 'Resolución Máxima', value: 'Hasta 8K' }
        );
      }
      break;
    
    case 'Computadores Gamers':
      specs.push(
        { label: 'Procesador', value: 'Intel Core i9 / AMD Ryzen 9' },
        { label: 'Tarjeta Gráfica', value: 'NVIDIA RTX 4080' },
        { label: 'RAM', value: '32GB DDR5' },
        { label: 'Almacenamiento', value: '1TB SSD NVMe' }
      );
      break;
    
    case 'Accesorios':
      if (product.nombre.toLowerCase().includes('auriculares')) {
        specs.push(
          { label: 'Tipo', value: 'Over-ear' },
          { label: 'Conectividad', value: 'USB / Jack 3.5mm' },
          { label: 'Micrófono', value: 'Desmontable con cancelación de ruido' },
          { label: 'Compatibilidad', value: 'PC, PS4, PS5, Xbox, Switch' }
        );
      } else if (product.nombre.toLowerCase().includes('control')) {
        specs.push(
          { label: 'Conectividad', value: 'Inalámbrica Bluetooth' },
          { label: 'Batería', value: 'Hasta 40 horas' },
          { label: 'Compatibilidad', value: 'Xbox Series X|S, PC' },
          { label: 'Botones', value: 'Mapeables' }
        );
      }
      break;
    
    case 'Mouse':
      specs.push(
        { label: 'Sensor', value: 'Óptico de alta precisión' },
        { label: 'DPI', value: 'Hasta 25,600' },
        { label: 'Botones', value: '11 programables' },
        { label: 'Peso', value: 'Ajustable (121g)' }
      );
      break;
    
    case 'Sillas Gamers':
      specs.push(
        { label: 'Material', value: 'Cuero sintético premium' },
        { label: 'Altura ajustable', value: 'Sí, con pistón de gas' },
        { label: 'Reposabrazos', value: '4D ajustables' },
        { label: 'Peso máximo', value: '130 kg' }
      );
      break;
    
    case 'Mousepad':
      specs.push(
        { label: 'Dimensiones', value: '920mm x 294mm x 3mm' },
        { label: 'Material', value: 'Tela micro-texturizada' },
        { label: 'Base', value: 'Goma antideslizante' },
        { label: 'RGB', value: 'Iluminación Chroma' }
      );
      break;
    
    case 'Poleras Personalizadas':
      specs.push(
        { label: 'Material', value: '100% Algodón' },
        { label: 'Tallas', value: 'S, M, L, XL, XXL' },
        { label: 'Estampado', value: 'Serigrafía de alta calidad' },
        { label: 'Lavado', value: 'A máquina, temperatura baja' }
      );
      break;

    case 'Juegos de Mesa':
      specs.push(
        { label: 'Jugadores', value: '2-4 jugadores' },
        { label: 'Edad recomendada', value: '+10 años' },
        { label: 'Duración', value: '60-90 minutos' },
        { label: 'Idioma', value: 'Español' }
      );
      break;
  }

  return specs;
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Buscar el producto por ID
  const product = rawProducts.find((p) => p.id_producto === id);

  if (!product) {
    return <Navigate to="/catalogo" replace />;
  }

  // Crear el objeto ProductDetail con especificaciones
  const productDetail: ProductDetail = {
    ...product,
    especificaciones: getSpecificationsForProduct(product)
  };

  return (
    <>
      <Navbar />
      
      {/* Banner con imagen de fondo */}
      <section 
        className="w-100 text-white py-4" 
        style={{ 
          minHeight: 180,
          background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200") center center / cover no-repeat'
        }}
      >
        <div className="container h-100 d-flex align-items-center" style={{ minHeight: 180 }}>
          <div>
            <h1 className="display-5 fw-bold" style={{ textShadow: '2px 2px 8px #000' }}>
              Detalles del Producto
            </h1>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="bg-dark py-5">
        <ProductDetailComponent product={productDetail} />
      </section>

      <Footer />
    </>
  );
};

export default ProductDetailPage;
