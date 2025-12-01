import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  const location = useLocation();
  const registered = (location.state as any)?.registered;

  // Limpiar el state para evitar que el mensaje persista si el usuario navega atrás
  useEffect(() => {
    if (registered) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }
  }, [registered]);

  return (
    <>
      <Navbar />
      {registered && (
        <div className="container mt-4">
          <div className="alert alert-success" role="alert">
            Registro exitoso. Ahora inicia sesión con tus credenciales.
          </div>
        </div>
      )}
      <LoginForm />
      <Footer />
    </>
  );
};

export default LoginPage;
