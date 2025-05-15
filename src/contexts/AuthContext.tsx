"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

const AUTH_KEY = 'stockflow_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializa como null/false/true para evitar hydration mismatch
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Só roda no client
    const auth = localStorage.getItem(AUTH_KEY);
    if (auth === 'true') {
      setUser({
        id: '1',
        name: 'Administrador',
        email: 'admin@admin.com',
        role: 'admin',
      });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
    // Sincroniza caso o localStorage mude em outra aba
    const syncAuth = () => {
      const auth = localStorage.getItem(AUTH_KEY);
      if (auth === 'true') {
        setUser({
          id: '1',
          name: 'Administrador',
          email: 'admin@admin.com',
          role: 'admin',
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (email === 'admin@admin.com' && password === '1234') {
        const userData: User = {
          id: '1',
          name: 'Administrador',
          email: 'admin@admin.com',
          role: 'admin',
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_KEY, 'true');
        router.push('/home');
      } else {
        setError('Usuário ou senha inválidos');
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem(AUTH_KEY);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Apenas simula cadastro, mas login só aceita admin@admin.com/1234
      setUser({
        id: Date.now().toString(),
        name,
        email,
        role: 'user',
      });
      setIsAuthenticated(false);
      localStorage.removeItem(AUTH_KEY);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider; 