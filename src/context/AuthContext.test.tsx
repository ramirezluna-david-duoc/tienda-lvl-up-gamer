import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';


// Login exitoso con credenciales válidas
// Y Login fallido con credenciales inválidas

// Componente helper para acceder al contexto en los tests
const TestComponent: React.FC = () => {
  const { isAuthenticated, user, login } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'autenticado' : 'no autenticado'}</div>
      <div data-testid="user-email">{user?.email || 'sin usuario'}</div>
      <button
        data-testid="login-valid-btn"
        onClick={() => login('user@duoc.cl', 'user123')}
      >
        Login Válido
      </button>
      <button
        data-testid="login-invalid-btn"
        onClick={() => login('invalido@ejemplo.com', 'wrongpass')}
      >
        Login Inválido
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  test('Login exitoso con credenciales válidas', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Verificar estado inicial no autenticado
    expect(screen.getByTestId('auth-status')).toHaveTextContent('no autenticado');
    expect(screen.getByTestId('user-email')).toHaveTextContent('sin usuario');

    // Realizar login con credenciales válidas
    act(() => {
      screen.getByTestId('login-valid-btn').click();
    });

    // Verificar que el usuario está autenticado
    expect(screen.getByTestId('auth-status')).toHaveTextContent('autenticado');
    expect(screen.getByTestId('user-email')).toHaveTextContent('user@duoc.cl');
  });

  test('Login fallido con credenciales inválidas', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Verificar estado inicial no autenticado
    expect(screen.getByTestId('auth-status')).toHaveTextContent('no autenticado');

    // Intentar login con credenciales inválidas
    act(() => {
      screen.getByTestId('login-invalid-btn').click();
    });

    // Verificar que el usuario sigue sin autenticar
    expect(screen.getByTestId('auth-status')).toHaveTextContent('no autenticado');
    expect(screen.getByTestId('user-email')).toHaveTextContent('sin usuario');
  });
});
