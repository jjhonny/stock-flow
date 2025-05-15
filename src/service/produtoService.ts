import { getLocalData, setLocalData } from './localStorageService';

export interface Produto {
  id: string;
  nome: string;
}

const PRODUTOS_KEY = 'produtos';

export function getProdutos(): Produto[] {
  return getLocalData<Produto[]>(PRODUTOS_KEY, []);
}

export function saveProduto(produto: Produto): void {
  const produtos = getProdutos();
  produtos.push(produto);
  setLocalData(PRODUTOS_KEY, produtos);
}

export function updateProdutos(produtos: Produto[]): void {
  setLocalData(PRODUTOS_KEY, produtos);
}

export function removeProduto(id: string): void {
  const produtos = getProdutos().filter(p => p.id !== id);
  setLocalData(PRODUTOS_KEY, produtos);
} 