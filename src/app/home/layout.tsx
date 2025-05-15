"use client";

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/ui/Header';

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName={user?.name} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-base-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm opacity-60">
          <p>© {new Date().getFullYear()} StockFlow. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
} 