import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => (
  <>
    <Navbar />
    <LoginForm />
    <Footer />
  </>
);

export default LoginPage;
