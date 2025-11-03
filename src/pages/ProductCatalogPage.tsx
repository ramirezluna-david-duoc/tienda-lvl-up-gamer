import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCatalog from '../components/ProductCatalog';

const ProductCatalogPage: React.FC = () => (
  <>
    <Navbar />
    <ProductCatalog />
    <Footer />
  </>
);

export default ProductCatalogPage;
