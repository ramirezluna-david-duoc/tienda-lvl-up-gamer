import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCatalog from './ProductCatalog';
import { CartProvider } from '../context/CartContext';


//  Filtra por categoría correctamente
//  y Búsqueda funciona y Botón agregar al carrito llama a addItem

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  BrowserRouter: ({ children }: any) => <div>{children}</div>
}));

// Mock del contexto del carrito para verificar llamadas
const mockAddItem = jest.fn();

jest.mock('../context/CartContext', () => ({
  ...jest.requireActual('../context/CartContext'),
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

describe('ProductCatalog', () => {
  beforeEach(() => {
    mockAddItem.mockClear();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <CartProvider>
        {component}
      </CartProvider>
    );
  };

  test('Filtra por categoría correctamente', () => {
    renderWithProviders(<ProductCatalog />);

    // Verificar que inicialmente se muestran todos los productos
    const productCards = screen.getAllByRole('button', { name: /agregar al carro/i });
    const initialCount = productCards.length;
    expect(initialCount).toBeGreaterThan(0);

    // Seleccionar una categoría específica (por ejemplo, "Consolas")
    const categorySelect = screen.getByLabelText(/categorías/i);
    fireEvent.change(categorySelect, { target: { value: 'Consolas' } });

    // Verificar que se filtran los productos
    const filteredCards = screen.getAllByRole('button', { name: /agregar al carro/i });
    expect(filteredCards.length).toBeLessThanOrEqual(initialCount);
    
    // Verificar que solo muestra productos de la categoría seleccionada
    expect(screen.getByText(/PlayStation 5/i)).toBeInTheDocument();
  });

  test('Búsqueda funciona', () => {
    renderWithProviders(<ProductCatalog />);

    // Obtener el input de búsqueda
    const searchInput = screen.getByPlaceholderText(/nombre o descripción/i);

    // Realizar búsqueda
    fireEvent.change(searchInput, { target: { value: 'PlayStation' } });

    // Verificar que solo aparecen productos que coinciden con la búsqueda
    expect(screen.getByText(/PlayStation 5/i)).toBeInTheDocument();
    
    // Verificar que productos no relacionados no aparecen
    expect(screen.queryByText(/Catan/i)).not.toBeInTheDocument();
  });

  test('Botón agregar al carrito llama a addItem', () => {
    renderWithProviders(<ProductCatalog />);

    // Encontrar todos los botones "Agregar al carro"
    const addToCartButtons = screen.getAllByRole('button', { name: /agregar al carro/i });
    
    // Hacer clic en el primer botón
    fireEvent.click(addToCartButtons[0]);

    // Verificar que se llamó a addItem
    expect(mockAddItem).toHaveBeenCalledTimes(1);
    
    // Verificar que se llamó con los parámetros correctos (estructura del producto)
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        nombre: expect.any(String),
        precio: expect.any(Number),
        imagen: expect.any(String)
      })
    );
  });
});
