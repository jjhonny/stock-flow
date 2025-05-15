"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FaTimesCircle } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full p-4">
        <Card
          title={
            <div className="text-center">
              <h1 className="text-3xl font-bold">StockFlow</h1>
              <p className="text-sm opacity-60">Sistema de Gerenciamento de Estoque</p>
            </div>
          }
          bordered
          className="w-full"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="alert alert-error">
                <FaTimesCircle className="stroke-current shrink-0 h-6 w-6" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Senha</span>
                <Link href="/recuperar-senha" className="label-text-alt link link-hover">
                  Esqueceu a senha?
                </Link>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control mt-6">
              <Button
                variant="primary"
                isBlock
                isLoading={loading}
                type="submit"
              >
                Entrar
              </Button>
            </div>
            
            <div className="divider">OU</div>
            
            <p className="text-center">
              Não tem uma conta?{' '}
              <Link href="/register" className="link link-primary">
                Cadastre-se
              </Link>
            </p>
          </form>
        </Card>
        
        <div className="mt-4 text-center text-sm opacity-60">
          <p>© {new Date().getFullYear()} StockFlow. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
} 