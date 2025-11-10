import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductDetailComponent from './ProductDetail';
import { ProductDetail } from '../types/ProductDetail';

// Renderiza información del producto y Botón agregar al carrito funciona

// Mock del contexto del carrito
const mockAddItem = jest.fn();

jest.mock('../context/CartContext', () => ({
  useCart: () => ({
    addItem: mockAddItem,
    items: [],
    totalItems: 0,
    totalPrice: 0,
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
    clearCart: jest.fn()
  })
}));

// Mock de require para las imágenes
jest.mock('../assets/imgs/productos/PlayStation 5/ps5_square.png', () => 'test-image.jpg', { virtual: true });

describe('ProductDetail', () => {
  beforeEach(() => {
    mockAddItem.mockClear();
  });

  const mockProduct: ProductDetail = {
    id_producto: 'TEST001',
    categoria: 'Consolas',
    nombre: 'PlayStation 5 Test',
    descripcion: 'Consola de última generación para testing',
    precio: 549990,
    imagen: 'productos/PlayStation 5/ps5_square.png',
    especificaciones: [
      { label: 'Almacenamiento', value: 'SSD de 1TB' },
      { label: 'Procesador', value: 'AMD Ryzen 8 núcleos' },
      { label: 'RAM', value: '16GB' }
    ]
  };

  const renderWithRouter = (component: React.ReactElement) => {
    return render(component);
  };

  test('Renderiza información del producto', () => {
    renderWithRouter(<ProductDetailComponent product={mockProduct} />);

    // Verificar que se muestra el nombre del producto
    expect(screen.getByText(/PlayStation 5 Test/i)).toBeInTheDocument();

    // Verificar que se muestra la categoría
    expect(screen.getByText(/Consolas/i)).toBeInTheDocument();

    // Verificar que se muestra el precio
    expect(screen.getByText(/\$549\.990/i)).toBeInTheDocument();

    // Verificar que se muestra la descripción
    expect(screen.getByText(/Consola de última generación para testing/i)).toBeInTheDocument();

    // Verificar que se muestran las especificaciones
    expect(screen.getByText(/Detalles del Producto/i)).toBeInTheDocument();
    expect(screen.getByText(/Almacenamiento/i)).toBeInTheDocument();
    expect(screen.getByText(/SSD de 1TB/i)).toBeInTheDocument();
    expect(screen.getByText(/Procesador/i)).toBeInTheDocument();
    expect(screen.getByText(/AMD Ryzen 8 núcleos/i)).toBeInTheDocument();
  });

  test('Botón agregar al carrito funciona', () => {
    renderWithRouter(<ProductDetailComponent product={mockProduct} />);

    // Encontrar el botón "Añadir al Carrito"
    const addToCartButton = screen.getByRole('button', { name: /añadir al carrito/i });
    
    // Hacer clic en el botón
    fireEvent.click(addToCartButton);

    // Verificar que se llamó a addItem
    expect(mockAddItem).toHaveBeenCalledTimes(1);
    
    // Verificar que se llamó con los parámetros correctos
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'TEST001',
        nombre: 'PlayStation 5 Test',
        precio: 549990
      })
    );
  });
});
