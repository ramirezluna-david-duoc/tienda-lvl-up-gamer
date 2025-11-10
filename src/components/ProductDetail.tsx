import React, { useState } from 'react';
import { ProductDetail } from '../types/ProductDetail';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetail.css';

interface ProductDetailComponentProps {
  product: ProductDetail;
}

const formatPriceCLP = (value: number) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);

const ProductDetailComponent: React.FC<ProductDetailComponentProps> = ({ product }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addItem } = useCart();

  const images = product.imagenes && product.imagenes.length > 0 
    ? product.imagenes 
    : [product.imagen];

  const resolvedImages = images.map((img) => {
    try {
      return require(`../assets/imgs/${img}`);
    } catch {
      return `https://via.placeholder.com/500x500/0a0a0a/ffffff?text=${encodeURIComponent(product.nombre)}`;
    }
  });

  const handleAddToCart = () => {
    addItem({
      id: product.id_producto,
      nombre: product.nombre,
      precio: product.precio,
      imagen: resolvedImages[0]
    });
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? resolvedImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === resolvedImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="container my-5 text-white">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb bg-transparent">
          <li className="breadcrumb-item">
            <a href="/" className="text-white text-decoration-underline">
              <i className="bi bi-house-fill me-1"></i>Inicio
            </a>
          </li>
          <li className="breadcrumb-item">
            <a href="/catalogo" className="text-white text-decoration-underline">
              <i className="bi bi-grid me-1"></i>Catálogo
            </a>
          </li>
          <li className="breadcrumb-item active text-white-50" aria-current="page">
            {product.nombre}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Columna Izquierda: Galería de Imágenes */}
        <div className="col-md-6">
          <div className="product-carousel">
            {/* Imagen Principal */}
            <div className="main-image-container position-relative">
              <img
                src={resolvedImages[activeImageIndex]}
                alt={product.nombre}
                className="img-fluid rounded main-product-image"
              />
              
              {/* Controles del Carousel */}
              {resolvedImages.length > 1 && (
                <>
                  <button
                    className="carousel-control carousel-control-prev"
                    onClick={handlePrevImage}
                  >
                    <i className="bi bi-arrow-left-square-fill fs-1 text-success"></i>
                  </button>
                  <button
                    className="carousel-control carousel-control-next"
                    onClick={handleNextImage}
                  >
                    <i className="bi bi-arrow-right-square-fill fs-1 text-success"></i>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {resolvedImages.length > 1 && (
              <div className="thumbnails-container d-flex justify-content-center gap-2 mt-3">
                {resolvedImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.nombre} - Vista ${index + 1}`}
                    className={`thumbnail-img ${index === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Información del Producto */}
        <div className="col-md-6">
          <div className="badge bg-secondary text-uppercase mb-2">{product.categoria}</div>
          <h2 className="mb-3">{product.nombre}</h2>
          <h3 className="text-success mb-3">{formatPriceCLP(product.precio)}</h3>
          <p className="lead text-white-50 mb-4">{product.descripcion}</p>

          {/* Botones de Acción */}
          <div className="d-grid gap-2 mb-4">
            <button className="btn btn-success btn-lg" onClick={handleAddToCart}>
              <i className="bi bi-cart-plus me-2"></i>
              Añadir al Carrito
            </button>
            <button className="btn btn-outline-success btn-lg">
              <i className="bi bi-lightning-charge me-2"></i>
              ¡Comprar Ahora!
            </button>
          </div>

          {/* Especificaciones Técnicas */}
          {product.especificaciones && product.especificaciones.length > 0 && (
            <>
              <hr className="border-secondary" />
              <h5 className="mb-3">
                <i className="bi bi-info-circle me-2"></i>
                Detalles del Producto
              </h5>
              <div className="row specs-table">
                {product.especificaciones.map((spec, index) => (
                  <React.Fragment key={index}>
                    <div className="col-6 mb-2">
                      <strong className="text-white-50">{spec.label}:</strong>
                    </div>
                    <div className="col-6 mb-2 text-end">{spec.value}</div>
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailComponent;
