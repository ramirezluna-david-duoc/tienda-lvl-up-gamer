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
import { AuthProvider } from './context/AuthContext';

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
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/catalogo" element={<ProductCatalogPage />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
