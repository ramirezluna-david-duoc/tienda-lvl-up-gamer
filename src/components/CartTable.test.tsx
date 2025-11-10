import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartTable from './CartTable';
import { CartProvider } from '../context/CartContext';
import { CartItem } from '../types/Cart';

// Muestra mensaje cuando está vacío y Botón eliminar funciona

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  BrowserRouter: ({ children }: any) => <div>{children}</div>
}));

// Mock del contexto con productos
const mockRemoveItem = jest.fn();
const mockIncrement = jest.fn();
const mockDecrement = jest.fn();
const mockClearCart = jest.fn();

const mockEmptyCart = {
  items: [] as CartItem[],
  totalItems: 0,
  totalPrice: 0,
  addItem: jest.fn(),
  removeItem: mockRemoveItem,
  updateQuantity: jest.fn(),
  increment: mockIncrement,
  decrement: mockDecrement,
  clearCart: mockClearCart
};

const mockCartWithItems = {
  items: [
    {
      id: 'TEST001',
      nombre: 'Producto Test 1',
      precio: 10000,
      cantidad: 2,
      imagen: 'test.jpg'
    },
    {
      id: 'TEST002',
      nombre: 'Producto Test 2',
      precio: 20000,
      cantidad: 1,
      imagen: 'test2.jpg'
    }
  ] as CartItem[],
  totalItems: 3,
  totalPrice: 40000,
  addItem: jest.fn(),
  removeItem: mockRemoveItem,
  updateQuantity: jest.fn(),
  increment: mockIncrement,
  decrement: mockDecrement,
  clearCart: mockClearCart
};

jest.mock('../context/CartContext', () => ({
  ...jest.requireActual('../context/CartContext'),
  useCart: jest.fn()
}));

const { useCart } = require('../context/CartContext');

describe('CartTable', () => {
  beforeEach(() => {
    mockRemoveItem.mockClear();
    mockClearCart.mockClear();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(component);
  };

  test('Muestra mensaje cuando está vacío', () => {
    useCart.mockReturnValue(mockEmptyCart);
    
    renderWithRouter(<CartTable />);

    // Verificar que se muestra el mensaje de carrito vacío
    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
    
    // Verificar que se muestra el botón para ir al catálogo
    expect(screen.getByRole('link', { name: /explorar productos/i })).toBeInTheDocument();
    
    // Verificar que NO se muestra la tabla
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('Botón eliminar funciona', () => {
    useCart.mockReturnValue(mockCartWithItems);
    
    renderWithRouter(<CartTable />);

    // Verificar que se muestran los productos
    expect(screen.getByText(/producto test 1/i)).toBeInTheDocument();
    expect(screen.getByText(/producto test 2/i)).toBeInTheDocument();

    // Encontrar todos los botones de eliminar (icono de basura)
    const deleteButtons = screen.getAllByRole('button', { name: /eliminar producto/i });
    
    // Hacer clic en el primer botón eliminar
    fireEvent.click(deleteButtons[0]);

    // Verificar que se llamó a removeItem con el ID correcto
    expect(mockRemoveItem).toHaveBeenCalledTimes(1);
    expect(mockRemoveItem).toHaveBeenCalledWith('TEST001');
  });
});
