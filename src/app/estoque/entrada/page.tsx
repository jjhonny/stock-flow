"use client";

import { useState, useEffect, useRef } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { getProdutos, saveProduto, Produto } from "@/service/produtoService";
import { getFornecedores, saveFornecedor, Fornecedor } from "@/service/fornecedorService";
import { saveNota, NotaEntrada, ProdutoItem, getNotas } from "@/service/notaService";
import { fakeNotas } from "@/service/fakeNotas";
import { useToast } from "@/components/Toast";

function gerarId() {
  return Date.now().toString() + Math.random().toString(36).substring(2, 8);
}

// Tipo local para uso na tela
interface ProdutoEntradaItem {
  id: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
  subtotal: number;
}

export default function EntradaEstoque() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Produtos e fornecedores do localStorage
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<Produto[]>([]);
  const [fornecedoresDisponiveis, setFornecedoresDisponiveis] = useState<Fornecedor[]>([]);

  useEffect(() => {
    setProdutosDisponiveis(getProdutos());
    setFornecedoresDisponiveis(getFornecedores());
  }, []);
  
  // Formulário
  const [fornecedor, setFornecedor] = useState("");
  const [numeroNota, setNumeroNota] = useState("");
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [observacoes, setObservacoes] = useState("");
  
  // Produto atual sendo adicionado
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [valorUnitario, setValorUnitario] = useState(0);
  
  // Itens da entrada (com subtotal)
  const [itens, setItens] = useState<ProdutoEntradaItem[]>([]);
  
  // Carregar nota fictícia ao digitar número
  useEffect(() => {
    if (numeroNota.length > 0) {
      const notaFake = fakeNotas.find(n => n.numero === numeroNota);
      if (notaFake) {
        setFornecedor(notaFake.fornecedor);
        setData(notaFake.data);
        setObservacoes(notaFake.observacoes || "");
        setItens(notaFake.produtos.map(prod => ({
          id: prod.id,
          nome: prod.nome,
          quantidade: prod.quantidadeDisponivel,
          valorUnitario: prod.valorUnitario || 0,
          subtotal: (prod.quantidadeDisponivel * (prod.valorUnitario || 0)),
        })));
      }
    }
  }, [numeroNota]);
  
  const { showToast } = useToast();
  
  // Adicionar produto à lista
  const adicionarProduto = () => {
    const produtoNome = produtoSelecionado.trim();
    if (!produtoNome || quantidade <= 0 || valorUnitario <= 0) {
      showToast('Preencha todos os campos do produto corretamente', 'error');
      return;
    }

    let produtoEncontrado = produtosDisponiveis.find(p => p.nome.toLowerCase() === produtoNome.toLowerCase());
    if (!produtoEncontrado) {
      // Produto novo, adicionar ao localStorage
      produtoEncontrado = { id: gerarId(), nome: produtoNome };
      saveProduto(produtoEncontrado);
      setProdutosDisponiveis(getProdutos());
    }

    const subtotal = quantidade * valorUnitario;

    // Verifica se o produto já existe na lista
    const itemExistente = itens.findIndex(item => item.id === produtoEncontrado!.id);

    if (itemExistente >= 0) {
      // Atualiza o item existente
      const novosItens = [...itens];
      novosItens[itemExistente].quantidade += quantidade;
      novosItens[itemExistente].valorUnitario = valorUnitario;
      novosItens[itemExistente].subtotal += subtotal;
      setItens(novosItens);
    } else {
      // Adiciona novo item
      setItens([
        ...itens,
        {
          id: produtoEncontrado.id,
          nome: produtoEncontrado.nome,
          quantidade,
          valorUnitario,
          subtotal
        }
      ]);
    }

    // Limpa o formulário de produto
    setProdutoSelecionado("");
    setQuantidade(1);
    setValorUnitario(0);
    showToast('Produto adicionado!', 'success');
  };
  
  // Remover produto da lista
  const removerProduto = (id: string) => {
    setItens(itens.filter(item => item.id !== id));
  };
  
  // Calcular o total da entrada
  const calcularTotal = () => {
    return itens.reduce((total, item) => total + item.subtotal, 0);
  };
  
  // Submeter o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (itens.length === 0) {
      showToast('Adicione pelo menos um produto', 'error');
      return;
    }
    
    if (!fornecedor || !numeroNota || !data) {
      showToast('Preencha todos os campos obrigatórios', 'error');
      return;
    }
    
    // Validação: não permitir entrada de nota já existente
    const notasExistentes = getNotas();
    if (notasExistentes.some(n => n.numero === numeroNota)) {
      showToast('Já existe uma entrada registrada para esta nota.', 'error');
      return;
    }
    
    // Verifica se fornecedor existe, se não existir adiciona
    let fornecedorObj = fornecedoresDisponiveis.find(f => f.id === fornecedor);
    if (!fornecedorObj) {
      fornecedorObj = { id: fornecedor, nome: fornecedor };
      saveFornecedor(fornecedorObj);
      setFornecedoresDisponiveis(getFornecedores());
    }
    
    setLoading(true);
    
    try {
      // Salva a nota no localStorage
      const nota: NotaEntrada = {
        id: gerarId(),
        numero: numeroNota,
        fornecedor: fornecedorObj.id,
        produtos: itens.map(item => ({
          id: item.id,
          nome: item.nome,
          quantidadeDisponivel: item.quantidade,
          valorUnitario: item.valorUnitario,
        })),
        data,
        observacoes,
      };
      saveNota(nota);
      
      showToast('Entrada de estoque registrada com sucesso!', 'success');
      
      // Limpar formulário após alguns segundos
      setTimeout(() => {
        setItens([]);
        setFornecedor("");
        setNumeroNota("");
        setData(new Date().toISOString().split('T')[0]);
        setObservacoes("");
        router.push('/home');
      }, 500);
    } catch (error) {
      showToast('Erro ao registrar entrada. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Entrada de Estoque</h1>
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
          <Card title="Informações da Nota" bordered>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Número da Nota</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered" 
                  value={numeroNota}
                  onChange={(e) => setNumeroNota(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fornecedor</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered" 
                  value={fornecedor}
                  readOnly
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Data</span>
                </label>
                <input 
                  type="date" 
                  className="input input-bordered" 
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Observações</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-20" 
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                ></textarea>
              </div>
            </form>
          </Card>
          
          <div className="mt-6">
            <Card title="Adicionar Produtos" bordered>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="form-control md:col-span-5">
                  <label className="label">
                    <span className="label-text">Produto</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Nome do produto"
                    value={produtoSelecionado}
                    onChange={e => setProdutoSelecionado(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Quantidade</span>
                  </label>
                  <input 
                    type="number" 
                    className="input input-bordered" 
                    min="1"
                    value={quantidade}
                    onChange={(e) => setQuantidade(parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="form-control md:col-span-3">
                  <label className="label">
                    <span className="label-text">Valor Unitário</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      R$
                    </span>
                    <input 
                      type="number" 
                      className="input input-bordered pl-10" 
                      min="0.01"
                      step="0.01"
                      value={valorUnitario}
                      onChange={(e) => setValorUnitario(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
            
              </div>
                  
              <div className="form-control md:col-span-2 flex justify-start items-start">
                  <Button 
                    variant="primary" 
                    onClick={adicionarProduto} 
                    className="w-24"
                  >
                    Adicionar
                  </Button>
                </div>
            </Card>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <Card title="Resumo da Entrada" bordered>
            <div className="overflow-x-auto mb-4">
              {itens.length > 0 ? (
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Qtd</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map((item) => (
                      <tr key={item.id}>
                        <td>{item.nome}</td>
                        <td>{item.quantidade}</td>
                        <td>R$ {item.subtotal.toFixed(2)}</td>
                        <td>
                          <button 
                            className="btn btn-ghost btn-xs text-error" 
                            onClick={() => removerProduto(item.id)}
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
                  Nenhum produto adicionado
                </div>
              )}
            </div>
            
            <div className="divider"></div>
            
            <div className="flex justify-between items-center text-lg font-bold mb-6">
              <span>Total:</span>
              <span>R$ {calcularTotal().toFixed(2)}</span>
            </div>
            
            <Button 
              variant="success" 
              isBlock 
              onClick={handleSubmit}
              isLoading={loading}
              disabled={itens.length === 0}
            >
              Finalizar Entrada
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
} 