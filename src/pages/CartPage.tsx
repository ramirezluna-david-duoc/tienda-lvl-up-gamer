import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartTable from '../components/CartTable';
import '../styles/Cart.css';
import bannerCarrito from '../assets/imgs/bg/ella-don-kCFXVisUqug-unsplash.jpg';

const CartPage: React.FC = () => {
  return (
    <>
      <Navbar />
      
      {/* Banner principal */}
      <section 
        className="w-100 text-white py-5 cart-banner-section" 
        style={{ 
          minHeight: 220,
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${bannerCarrito}) center center / cover no-repeat`
        }}
      >
        <div className="container h-100 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h1 className="display-4 fw-bold text-shadow mb-0" style={{ textShadow: '2px 2px 8px #000' }}>
              <i className="bi bi-cart4 me-3"></i>
              Carrito de Compras
            </h1>
          </div>
        </div>
      </section>

      {/* Contenido del carrito */}
      <section className="bg-dark text-white py-5">
        <div className="container">
          <div className="border-3 border border-primary rounded p-4">
            <CartTable />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default CartPage;
