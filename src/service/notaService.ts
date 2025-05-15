import { getLocalData, setLocalData } from './localStorageService';

export interface ProdutoItem {
  id: string;
  nome: string;
  quantidadeDisponivel: number;
  quantidadeSaida?: number;
  valorUnitario?: number;
}

export interface NotaEntrada {
  id: string;
  numero: string;
  fornecedor: string;
  produtos: ProdutoItem[];
  data: string;
  observacoes?: string;
}

const NOTAS_KEY = 'notas_entrada';

export function getNotas(): NotaEntrada[] {
  return getLocalData<NotaEntrada[]>(NOTAS_KEY, []);
}

export function saveNota(nota: NotaEntrada): void {
  const notas = getNotas();
  notas.push(nota);
  setLocalData(NOTAS_KEY, notas);
}

export function updateNotas(notas: NotaEntrada[]): void {
  setLocalData(NOTAS_KEY, notas);
}

export function removeNota(id: string): void {
  const notas = getNotas().filter(n => n.id !== id);
  setLocalData(NOTAS_KEY, notas);
} 