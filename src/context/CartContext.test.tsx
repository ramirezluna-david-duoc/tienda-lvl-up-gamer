import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';


// Agregar producto al carrito Y Eliminar producto

// Componente helper para acceder al contexto en los tests
const TestComponent: React.FC = () => {
  const { items, totalItems, addItem, removeItem } = useCart();
  
  return (
    <div>
      <div data-testid="item-count">{items.length}</div>
      <div data-testid="total-items">{totalItems}</div>
      <button
        data-testid="add-btn"
        onClick={() => addItem({ id: 'TEST001', nombre: 'Producto Test', precio: 10000 })}
      >
        Agregar
      </button>
      <button
        data-testid="remove-btn"
        onClick={() => removeItem('TEST001')}
      >
        Eliminar
      </button>
      {items.map(item => (
        <div key={item.id} data-testid={`item-${item.id}`}>
          {item.nombre} - Cantidad: {item.cantidad}
        </div>
      ))}
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  test('Agregar producto al carrito', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Verificar estado inicial vacío
    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');

    // Agregar producto
    act(() => {
      screen.getByTestId('add-btn').click();
    });

    // Verificar que el producto fue agregado
    expect(screen.getByTestId('item-count')).toHaveTextContent('1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('1');
    expect(screen.getByTestId('item-TEST001')).toBeInTheDocument();
    expect(screen.getByText(/Producto Test - Cantidad: 1/i)).toBeInTheDocument();
  });

  test('Eliminar producto del carrito', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Agregar producto primero
    act(() => {
      screen.getByTestId('add-btn').click();
    });

    // Verificar que el producto está en el carrito
    expect(screen.getByTestId('item-count')).toHaveTextContent('1');
    expect(screen.getByTestId('item-TEST001')).toBeInTheDocument();

    // Eliminar producto
    act(() => {
      screen.getByTestId('remove-btn').click();
    });

    // Verificar que el producto fue eliminado
    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.queryByTestId('item-TEST001')).not.toBeInTheDocument();
  });
});
