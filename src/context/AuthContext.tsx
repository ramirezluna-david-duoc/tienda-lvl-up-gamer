import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id?: number;
  email: string;
  nombre?: string;
  role: 'admin' | 'user';
  user?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (identifier: string, password: string) => Promise<{ success: boolean; role?: 'admin' | 'user'; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// El backend valida credenciales; aquí sólo almacenamos user + token

const ADMIN_FALLBACK = { email: 'admin@duoc.cl', password: 'admin123', role: 'admin' as const, nombre: 'Administrador' };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = async (identifier: string, password: string): Promise<{ success: boolean; role?: 'admin' | 'user'; message?: string }> => {
    const trimmedId = identifier.trim().toLowerCase();
    const trimmedPwd = password.trim();

    // Fallback local admin (no depende del backend). Se ejecuta antes de llamar al API.
    if (trimmedId === ADMIN_FALLBACK.email.toLowerCase() && trimmedPwd === ADMIN_FALLBACK.password) {
      const userData: User = { email: ADMIN_FALLBACK.email, nombre: ADMIN_FALLBACK.nombre, role: ADMIN_FALLBACK.role };
      const token = 'admin-local-token';
      setUser(userData);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      return { success: true, role: userData.role };
    }

    // Login normal contra backend (email o username)
    try {
      const { user: u, token } = await api.login(trimmedId, trimmedPwd);
      const userData: User = { id: u.id, email: u.email, nombre: u.nombre, role: (u.rol as any) || 'user', user: u.user };
      setUser(userData);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      return { success: true, role: userData.role };
    } catch (e: any) {
      const msg = e?.message || 'Error al iniciar sesión';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
