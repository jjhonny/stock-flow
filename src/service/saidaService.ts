import { getLocalData, setLocalData } from './localStorageService';
import { ProdutoItem } from './notaService';

export interface SaidaEstoque {
  id: string;
  notaId: string;
  data: string;
  motivo: string;
  destinatario?: string;
  observacoes?: string;
  itens: ProdutoItem[];
}

const SAIDAS_KEY = 'saidas_estoque';

export function getSaidas(): SaidaEstoque[] {
  return getLocalData<SaidaEstoque[]>(SAIDAS_KEY, []);
}

export function saveSaida(saida: SaidaEstoque): void {
  const saidas = getSaidas();
  saidas.push(saida);
  setLocalData(SAIDAS_KEY, saidas);
}

export function updateSaidas(saidas: SaidaEstoque[]): void {
  setLocalData(SAIDAS_KEY, saidas);
}

export function removeSaida(id: string): void {
  const saidas = getSaidas().filter(s => s.id !== id);
  setLocalData(SAIDAS_KEY, saidas);
} 