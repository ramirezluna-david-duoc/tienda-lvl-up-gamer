import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => (
  <>
    <Navbar />
    <RegisterForm />
    <Footer />
  </>
);

export default RegisterPage;
