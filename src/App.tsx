import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProductCatalogPage from './pages/ProductCatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminHome from './pages/AdminHome';
import AdminProductos from './pages/AdminProductos';
import AdminUsuarios from './pages/AdminUsuarios';
import NuevoProducto from './pages/NuevoProducto';
import NuevoUsuario from './pages/NuevoUsuario';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* rutas */}
            <Route path="/" element={<Navigate to="/catalogo" replace />} />
            <Route path="/catalogo" element={<ProductCatalogPage />} />
            <Route path="/producto/:id" element={<ProductDetailPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/productos" element={<AdminProductos />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="/admin/productos/nuevo" element={<NuevoProducto />} />
            <Route path="/admin/usuarios/nuevo" element={<NuevoUsuario />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
