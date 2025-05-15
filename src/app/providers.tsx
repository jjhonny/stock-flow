"use client";

import { ReactNode, useEffect } from "react";
import { ToastProvider } from "@/components/Toast";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Usar useEffect para garantir que o componente só seja renderizado no lado do cliente
    // Verificar se existe um tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    // Se existir, aplicar o tema
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Se não existir, verificar a preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', defaultTheme);
      localStorage.setItem('theme', defaultTheme);
    }
  }, []);

  return <ToastProvider>{children}</ToastProvider>;
} 