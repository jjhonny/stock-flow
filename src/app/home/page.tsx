"use client";

import { useAuth } from "@/contexts/AuthContext";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { FaBox, FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getProdutos, Produto } from "@/service/produtoService";
import { getNotas, NotaEntrada } from "@/service/notaService";
import { getSaidas, SaidaEstoque } from "@/service/saidaService";

export default function Home() {
  const { user } = useAuth();

  // Dados locais
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [notas, setNotas] = useState<NotaEntrada[]>([]);
  const [saidas, setSaidas] = useState<SaidaEstoque[]>([]);

  useEffect(() => {
    setProdutos(getProdutos());
    setNotas(getNotas());
    setSaidas(getSaidas());
  }, []);

  // Estatísticas
  const totalProdutos = produtos.length;
  const totalEntradas = notas.length;
  const totalSaidas = saidas.length;

  const estatisticas = [
    {
      titulo: "Produtos",
      valor: totalProdutos,
      icone: <FaBox className="w-10 h-10" />,
      cor: "bg-primary text-primary-content",
      link: "/produtos",
    },
    {
      titulo: "Entradas",
      valor: totalEntradas,
      icone: <FaArrowAltCircleDown className="w-10 h-10" />,
      cor: "bg-success text-success-content",
      link: "/estoque/entrada",
    },
    {
      titulo: "Saídas",
      valor: totalSaidas,
      icone: <FaArrowAltCircleUp className="w-10 h-10" />,
      cor: "bg-warning text-warning-content",
      link: "/estoque/saida",
    },
  ];

  // Produtos com baixo estoque (considerando todas as notas)
  const produtosEstoque: { id: string; nome: string; quantidade: number; minimo: number }[] = produtos.map(prod => {
    // Soma o estoque disponível em todas as notas para esse produto
    let quantidade = 0;
    notas.forEach(nota => {
      const prodNota = nota.produtos.find(p => p.id === prod.id);
      if (prodNota) quantidade += prodNota.quantidadeDisponivel;
    });
    return {
      id: prod.id,
      nome: prod.nome,
      quantidade,
      minimo: 10, // valor fixo para exemplo
    };
  });
  const produtosBaixoEstoque = produtosEstoque.filter(p => p.quantidade <= p.minimo);

  // Movimentações recentes (entradas e saídas)
  const movimentacoesRecentes: { id: string; tipo: string; produto: string; quantidade: number; data: string }[] = [];
  notas.forEach(nota => {
    nota.produtos.forEach(prod => {
      movimentacoesRecentes.push({
        id: nota.id + '-' + prod.id + '-entrada',
        tipo: 'entrada',
        produto: prod.nome,
        quantidade: prod.quantidadeDisponivel, // valor atual, não histórico
        data: nota.data,
      });
    });
  });
  saidas.forEach(saida => {
    saida.itens.forEach(item => {
      movimentacoesRecentes.push({
        id: saida.id + '-' + item.id + '-saida',
        tipo: 'saida',
        produto: item.nome,
        quantidade: item.quantidadeSaida ?? 0,
        data: saida.data,
      });
    });
  });
  movimentacoesRecentes.sort((a, b) => b.data.localeCompare(a.data));

  return (
    <div className="space-y-8 px-2">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-base-content/70">
            Bem-vindo, {user?.name || "Usuário"}! Aqui está um resumo do seu
            estoque.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/estoque/entrada"
            className="btn btn-primary btn-sm md:btn-md"
          >
            Nova Entrada
          </Link>
          <Link
            href="/estoque/saida"
            className="btn btn-warning btn-sm md:btn-md"
          >
            Nova Saída
          </Link>
        </div>
      </div>
      {/* Cards de estatísticas */}
      <div className="flex justify-center items-center gap-4">
        {estatisticas.map((estatistica, index) => (
          <div
            key={index}
            className={`card shadow-md ${estatistica.cor} transition-all duration-200 hover:shadow-lg hover:scale-105 w-96`}
          >
            <Link href={estatistica.link} className="card-body p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="card-title">{estatistica.titulo}</h2>
                  <p className="text-3xl font-bold">{estatistica.valor}</p>
                </div>
                <div className="opacity-80">{estatistica.icone}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de produtos com baixo estoque */}
        <Card
          title="Produtos com Baixo Estoque"
          subtitle="Produtos que precisam de reposição"
          bordered
          contentClassName="p-4"
        >
          <div className="overflow-x-auto">
            {produtosBaixoEstoque.length > 0 ? (
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Estoque</th>
                    <th>Mínimo</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosBaixoEstoque.map((produto) => (
                    <tr key={produto.id}>
                      <td>{produto.nome}</td>
                      <td>{produto.quantidade}</td>
                      <td>{produto.minimo}</td>
                      <td>
                        <div
                          className={`badge ${
                            produto.quantidade === 0
                              ? "badge-error"
                              : produto.quantidade <= produto.minimo / 2
                              ? "badge-warning"
                              : "badge-info"
                          }`}
                        >
                          {produto.quantidade === 0
                            ? "Esgotado"
                            : produto.quantidade <= produto.minimo / 2
                            ? "Crítico"
                            : "Baixo"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-base-content/70">
                sem registros
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <Link href="/produtos" className="btn btn-sm btn-outline">
              Ver todos os produtos
            </Link>
          </div>
        </Card>
        {/* Movimentações recentes */}
        <Card
          title="Movimentações Recentes"
          subtitle="Últimas entradas e saídas do estoque"
          bordered
          contentClassName="p-4"
        >
          <div className="overflow-x-auto">
            {movimentacoesRecentes.length > 0 ? (
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Tipo</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {movimentacoesRecentes.slice(0, 10).map((movimentacao) => (
                    <tr key={movimentacao.id}>
                      <td>{movimentacao.produto}</td>
                      <td>{movimentacao.quantidade}</td>
                      <td>
                        <div
                          className={`badge ${
                            movimentacao.tipo === "entrada"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {movimentacao.tipo === "entrada" ? "Entrada" : "Saída"}
                        </div>
                      </td>
                      <td>{movimentacao.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-base-content/70">
                sem movimentações
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <Link href="/estoque/consulta" className="btn btn-sm btn-outline">
              Ver todas as movimentações
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
} 