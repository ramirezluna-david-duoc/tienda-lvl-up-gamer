import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import CategoriasSimple from './components/CategoriasSimple';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductCatalogPage from './pages/ProductCatalogPage';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from "./components/Layout";
import AdminProductos from "./pages/AdminProductos";
import { Productos } from "./pages/Producto";
import AdminHome from "./pages/AdminHome";
import NuevoProducto from "./pages/NuevoProducto";
import AdminUsuarios from "./pages/AdminUsuarios";
import NuevoUsuario from "./pages/NuevoUsuario";
import AdminCategorias from "./pages/AdminCategorias";
import EditarProducto from "./pages/EditarProducto";
import EditarCategoria from "./pages/EditarCategoria";
import EditarUsuario from "./pages/EditarUsuario";

const HomePage: React.FC = () => (
  <>
    <Navbar />
    <Hero />
    <CategoriasSimple />
    <Footer />
  </>
);

const App: React.FC = () => (
  <AuthProvider>
    <CartProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/catalogo" element={<ProductCatalogPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          
          {/* Rutas de administración */}
          <Route element={<Layout />}>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/productos" element={<AdminProductos />} />
            <Route path="/nuevo-producto" element={<NuevoProducto />} />
            <Route path="/producto" element={<Productos />} />
            <Route path="/usuarios" element={<AdminUsuarios />} />
            <Route path="/nuevo-usuario" element={<NuevoUsuario />} />
            <Route path="/categorias" element={<AdminCategorias />} />
            <Route path="/editar-producto/:id" element={<EditarProducto />} />
            <Route path="/editar-categoria/:id" element={<EditarCategoria />} />
            <Route path="/editar-usuario/:id" element={<EditarUsuario />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  </AuthProvider>
);

export default App;
