"use client";

import { useState, useEffect, useRef } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { getNotas, NotaEntrada, ProdutoItem, updateNotas } from "@/service/notaService";
import { saveSaida, type SaidaEstoque } from "@/service/saidaService";
import { useToast } from "@/components/Toast";

function gerarId() {
  return Date.now().toString() + Math.random().toString(36).substring(2, 8);
}

export default function SaidaEstoque() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Notas de entrada do localStorage
  const [notasDisponiveis, setNotasDisponiveis] = useState<NotaEntrada[]>([]);
  useEffect(() => {
    setNotasDisponiveis(getNotas());
  }, []);

  // Só mostrar notas com pelo menos um produto disponível
  const notasComProdutosDisponiveis = notasDisponiveis.filter(nota =>
    nota.produtos.some(p => p.quantidadeDisponivel > 0)
  );

  // Formulário
  const [notaSelecionada, setNotaSelecionada] = useState<string>("");
  const [dataSaida, setDataSaida] = useState(new Date().toISOString().split('T')[0]);
  const [motivo, setMotivo] = useState("");
  const [erroMotivo, setErroMotivo] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Produtos da nota selecionada
  const [quantidadesSaida, setQuantidadesSaida] = useState<{ [produtoId: string]: number }>({});
  const produtosDaNota = notasDisponiveis.find(n => n.id === notaSelecionada)?.produtos || [];

  // Itens de saída
  const [itensSaida, setItensSaida] = useState<ProdutoItem[]>([]);

  // Atualizar quantidade de saída no input
  const handleQuantidadeChange = (id: string, value: number) => {
    setQuantidadesSaida(qs => ({ ...qs, [id]: value }));
  };

  const { showToast } = useToast();

  // Adicionar produto à saída
  const adicionarProdutoSaida = (produto: ProdutoItem) => {
    const quantidadeSaida = quantidadesSaida[produto.id] || 0;
    if (quantidadeSaida <= 0 || quantidadeSaida > produto.quantidadeDisponivel) {
      showToast('Quantidade inválida para o produto selecionado', 'error');
      return;
    }
    // Verifica se já está na lista
    const jaExiste = itensSaida.find(item => item.id === produto.id);
    if (jaExiste) {
      showToast('Produto já adicionado à saída', 'error');
      return;
    }
    setItensSaida([...itensSaida, { ...produto, quantidadeSaida }]);
    showToast('Produto adicionado à saída!', 'success');
  };

  // Remover produto da saída
  const removerProdutoSaida = (id: string) => {
    setItensSaida(itensSaida.filter(item => item.id !== id));
  };

  // Submeter o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let erro = false;
    if (!motivo) {
      setErroMotivo("O motivo da saída é obrigatório.");
      showToast('Preencha todos os campos obrigatórios', 'error');
      erro = true;
    } else {
      setErroMotivo("");
    }
    if (!notaSelecionada) {
      showToast('Selecione uma nota de entrada', 'error');
      erro = true;
    }
    if (!dataSaida) {
      showToast('Preencha todos os campos obrigatórios', 'error');
      erro = true;
    }
    if (itensSaida.length === 0) {
      showToast('Adicione pelo menos um produto à saída', 'error');
      erro = true;
    }
    for (const item of itensSaida) {
      const quantidadeSaida = item.quantidadeSaida ?? 0;
      if (quantidadeSaida <= 0 || quantidadeSaida > item.quantidadeDisponivel) {
        showToast(`Quantidade inválida para o produto ${item.nome}`, 'error');
        erro = true;
        break;
      }
    }
    if (erro) return;
    setLoading(true);
    try {
      // Atualiza a nota de entrada (baixa estoque)
      const notas = getNotas();
      const notaIdx = notas.findIndex(n => n.id === notaSelecionada);
      if (notaIdx === -1) throw new Error('Nota não encontrada');
      const nota = { ...notas[notaIdx] };
      nota.produtos = nota.produtos.map(prod => {
        const saida = itensSaida.find(item => item.id === prod.id);
        if (saida) {
          return {
            ...prod,
            quantidadeDisponivel: prod.quantidadeDisponivel - (saida.quantidadeSaida ?? 0),
          };
        }
        return prod;
      });
      notas[notaIdx] = nota;
      updateNotas(notas);

      // Salva a saída no localStorage
      const saida: SaidaEstoque = {
        id: gerarId(),
        notaId: notaSelecionada,
        data: dataSaida,
        motivo,
        destinatario,
        observacoes,
        itens: itensSaida,
      };
      saveSaida(saida);

      showToast('Saída de estoque registrada com sucesso!', 'success');
      setTimeout(() => {
        setNotaSelecionada("");
        setDataSaida(new Date().toISOString().split('T')[0]);
        setMotivo("");
        setDestinatario("");
        setObservacoes("");
        setItensSaida([]);
        router.push('/home');
      }, 500);
    } catch (error) {
      showToast('Erro ao registrar saída. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Saída de Estoque</h1>
        <Button variant="ghost" onClick={() => router.back()} startIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
          }>
          Voltar
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card title="Informações da Saída" bordered>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" id="saida-form" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label" htmlFor="nota-entrada">
                  <span className="label-text">Nota de Entrada</span>
                </label>
                <select
                  id="nota-entrada"
                  className="select select-bordered w-full"
                  value={notaSelecionada}
                  onChange={e => {
                    setNotaSelecionada(e.target.value);
                    setItensSaida([]);
                  }}
                  required
                >
                  <option value="">Selecione uma nota</option>
                  {notasComProdutosDisponiveis.map(nota => (
                    <option key={nota.id} value={nota.id}>
                      {nota.numero} - {nota.fornecedor}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label" htmlFor="data-saida">
                  <span className="label-text">Data da Saída</span>
                </label>
                <input
                  id="data-saida"
                  type="date"
                  className="input input-bordered"
                  value={dataSaida}
                  onChange={e => setDataSaida(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="motivo-saida">
                  <span className="label-text">Motivo da Saída</span>
                </label>
                <input
                  id="motivo-saida"
                  type="text"
                  className="input input-bordered"
                  value={motivo}
                  onChange={e => {
                    setMotivo(e.target.value);
                    if (e.target.value) setErroMotivo("");
                  }}
                />
                {erroMotivo && (
                  <span className="text-error text-xs mt-1">{erroMotivo}</span>
                )}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="destinatario">
                  <span className="label-text">Destinatário (opcional)</span>
                </label>
                <input
                  id="destinatario"
                  type="text"
                  className="input input-bordered"
                  value={destinatario}
                  onChange={e => setDestinatario(e.target.value)}
                />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label" htmlFor="observacoes">
                  <span className="label-text">Observações</span>
                </label>
                <textarea
                  id="observacoes"
                  className="textarea textarea-bordered h-20"
                  value={observacoes}
                  onChange={e => setObservacoes(e.target.value)}
                ></textarea>
              </div>
            </form>
          </Card>
          <div className="mt-6">
            <Card title="Produtos da Nota" bordered>
              <div className="overflow-x-auto mb-4">
                {produtosDaNota.length > 0 ? (
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Qtd Disponível</th>
                        <th>Qtd Saída</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtosDaNota.map(produto => (
                        <tr key={produto.id}>
                          <td>{produto.nome}</td>
                          <td>{produto.quantidadeDisponivel}</td>
                          <td>
                            <input
                              id={`quantidade-${produto.id}`}
                              type="number"
                              className="input input-bordered w-24"
                              min={1}
                              max={produto.quantidadeDisponivel}
                              value={quantidadesSaida[produto.id] || ""}
                              onChange={e => handleQuantidadeChange(produto.id, parseInt(e.target.value) || 0)}
                              disabled={itensSaida.some(item => item.id === produto.id)}
                            />
                          </td>
                          <td>
                            <Button
                              id={`dar-saida-${produto.id}`}
                              data-testid={`dar-saida-${produto.id}`}
                              variant="primary"
                              size="sm"
                              onClick={() => adicionarProdutoSaida(produto)}
                              disabled={itensSaida.some(item => item.id === produto.id) || (quantidadesSaida[produto.id] || 0) <= 0}
                            >
                              Dar Saída
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center text-base-content/70">
                    Selecione uma nota para ver os produtos
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
        <div className="lg:col-span-4">
          <Card title="Resumo da Saída" bordered>
            <div className="overflow-x-auto mb-4">
              {itensSaida.length > 0 ? (
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Qtd Saída</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itensSaida.map(item => (
                      <tr key={item.id}>
                        <td>{item.nome}</td>
                        <td>{item.quantidadeSaida ?? 0}</td>
                        <td>
                          <button
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() => removerProdutoSaida(item.id)}
                          >
                            <FaTimes className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center text-base-content/70">
                  Nenhum produto adicionado à saída
                </div>
              )}
            </div>
            <Button
              variant="success"
              isBlock
              type="submit"
              form="saida-form"
              isLoading={loading}
              disabled={itensSaida.length === 0}
            >
              Finalizar Saída
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
} 