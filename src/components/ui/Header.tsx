"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { FaBars, FaTimes } from 'react-icons/fa';

interface HeaderProps {
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Implementar lógica de logout aqui
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="w-full bg-base-100 shadow-md sticky top-0 z-30">
      <div className="container mx-auto">
        <div className="navbar px-2 sm:px-4">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <FaBars className="h-5 w-5" />
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link href="/home">Início</Link></li>
                <li>
                  <details>
                    <summary>Estoque</summary>
                    <ul className="p-2 bg-base-100">
                      <li><Link href="/estoque/entrada">Entrada</Link></li>
                      <li><Link href="/estoque/saida">Saída</Link></li>
                      <li><Link href="/estoque/consulta">Consulta</Link></li>
                    </ul>
                  </details>
                </li>
                <li><Link href="/produtos">Produtos</Link></li>
                <li><Link href="/fornecedores">Fornecedores</Link></li>
                <li><Link href="/relatorios">Relatórios</Link></li>
              </ul>
            </div>
            <Link href="/home" className="btn btn-ghost text-xl">StockFlow</Link>
          </div>
          
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal gap-1">
              <li><Link href="/home" className="rounded-lg">Início</Link></li>
              <li>
                <details>
                  <summary className="rounded-lg">Estoque</summary>
                  <ul className="p-2 bg-base-100 rounded-box shadow-lg z-[1] mt-2">
                    <li><Link href="/estoque/entrada">Entrada</Link></li>
                    <li><Link href="/estoque/saida">Saída</Link></li>
                    <li><Link href="/estoque/consulta">Consulta</Link></li>
                  </ul>
                </details>
              </li>
              <li><Link href="/produtos" className="rounded-lg">Produtos</Link></li>
              <li><Link href="/fornecedores" className="rounded-lg">Fornecedores</Link></li>
              <li><Link href="/relatorios" className="rounded-lg">Relatórios</Link></li>
            </ul>
          </div>
          
          <div className="navbar-end gap-1">
           {/*  <ThemeToggle /> */}
            {userName ? (
              <div className="dropdown dropdown-end ml-2">
                <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                      <span>{userName.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{userName}</span>
                </div>
                <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                  <li><Link href="/perfil">Perfil</Link></li>
                  <li><Link href="/configuracoes">Configurações</Link></li>
                  <li><button onClick={handleLogout}>Sair</button></li>
                </ul>
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary btn-sm md:btn-md">Login</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 