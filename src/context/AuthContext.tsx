import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  nombre?: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; role?: 'admin' | 'user' };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciales predefinidas
const VALID_CREDENTIALS = [
  {
    email: 'admin@duoc.cl',
    password: 'admin123',
    role: 'admin' as const,
    nombre: 'Administrador'
  },
  {
    email: 'user@duoc.cl',
    password: 'user123',
    role: 'user' as const,
    nombre: 'Usuario'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email: string, password: string): { success: boolean; role?: 'admin' | 'user' } => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    const validUser = VALID_CREDENTIALS.find(
      (cred) => cred.email.toLowerCase() === trimmedEmail && cred.password === trimmedPassword
    );

    if (validUser) {
      const userData: User = {
        email: trimmedEmail,
        nombre: validUser.nombre,
        role: validUser.role
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, role: validUser.role };
    }
    return { success: false };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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
