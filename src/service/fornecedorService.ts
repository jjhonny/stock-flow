import { getLocalData, setLocalData } from './localStorageService';

export interface Fornecedor {
  id: string;
  nome: string;
}

const FORNECEDORES_KEY = 'fornecedores';

export function getFornecedores(): Fornecedor[] {
  return getLocalData<Fornecedor[]>(FORNECEDORES_KEY, []);
}

export function saveFornecedor(fornecedor: Fornecedor): void {
  const fornecedores = getFornecedores();
  fornecedores.push(fornecedor);
  setLocalData(FORNECEDORES_KEY, fornecedores);
}

export function updateFornecedores(fornecedores: Fornecedor[]): void {
  setLocalData(FORNECEDORES_KEY, fornecedores);
}

export function removeFornecedor(id: string): void {
  const fornecedores = getFornecedores().filter(f => f.id !== id);
  setLocalData(FORNECEDORES_KEY, fornecedores);
} 