import { NotaEntrada } from "./notaService";

export const fakeNotas: NotaEntrada[] = [
  {
    id: "n1",
    numero: "10001",
    fornecedor: "Fornecedor X",
    produtos: [
      { id: "p1", nome: "Produto A", quantidadeDisponivel: 50, valorUnitario: 10.5 },
      { id: "p2", nome: "Produto B", quantidadeDisponivel: 30, valorUnitario: 25.0 },
    ],
    data: "2024-06-01",
    observacoes: "Nota teste 1",
  },
  {
    id: "n2",
    numero: "10002",
    fornecedor: "Fornecedor Y",
    produtos: [
      { id: "p3", nome: "Produto C", quantidadeDisponivel: 20, valorUnitario: 15.75 },
      { id: "p4", nome: "Produto D", quantidadeDisponivel: 10, valorUnitario: 8.9 },
    ],
    data: "2024-06-02",
    observacoes: "Nota teste 2",
  },
  {
    id: "n3",
    numero: "10003",
    fornecedor: "Fornecedor Z",
    produtos: [
      { id: "p5", nome: "Produto E", quantidadeDisponivel: 15, valorUnitario: 12.0 },
      { id: "p1", nome: "Produto A", quantidadeDisponivel: 5, valorUnitario: 10.5 },
    ],
    data: "2024-06-03",
    observacoes: "Nota teste 3",
  },
  {
    id: "n4",
    numero: "10004",
    fornecedor: "Fornecedor X",
    produtos: [
      { id: "p2", nome: "Produto B", quantidadeDisponivel: 12, valorUnitario: 25.0 },
      { id: "p6", nome: "Produto F", quantidadeDisponivel: 8, valorUnitario: 30.0 },
    ],
    data: "2024-06-04",
    observacoes: "Nota teste 4",
  },
  {
    id: "n5",
    numero: "10005",
    fornecedor: "Fornecedor Y",
    produtos: [
      { id: "p7", nome: "Produto G", quantidadeDisponivel: 25, valorUnitario: 7.5 },
      { id: "p3", nome: "Produto C", quantidadeDisponivel: 7, valorUnitario: 15.75 },
    ],
    data: "2024-06-05",
    observacoes: "Nota teste 5",
  },
  {
    id: "n6",
    numero: "10006",
    fornecedor: "Fornecedor Z",
    produtos: [
      { id: "p8", nome: "Produto H", quantidadeDisponivel: 18, valorUnitario: 22.0 },
      { id: "p4", nome: "Produto D", quantidadeDisponivel: 6, valorUnitario: 8.9 },
    ],
    data: "2024-06-06",
    observacoes: "Nota teste 6",
  },
  {
    id: "n7",
    numero: "10007",
    fornecedor: "Fornecedor X",
    produtos: [
      { id: "p9", nome: "Produto I", quantidadeDisponivel: 22, valorUnitario: 18.0 },
      { id: "p5", nome: "Produto E", quantidadeDisponivel: 9, valorUnitario: 12.0 },
    ],
    data: "2024-06-07",
    observacoes: "Nota teste 7",
  },
  {
    id: "n8",
    numero: "10008",
    fornecedor: "Fornecedor Y",
    produtos: [
      { id: "p10", nome: "Produto J", quantidadeDisponivel: 14, valorUnitario: 9.99 },
      { id: "p6", nome: "Produto F", quantidadeDisponivel: 11, valorUnitario: 30.0 },
    ],
    data: "2024-06-08",
    observacoes: "Nota teste 8",
  },
  {
    id: "n9",
    numero: "10009",
    fornecedor: "Fornecedor Z",
    produtos: [
      { id: "p1", nome: "Produto A", quantidadeDisponivel: 13, valorUnitario: 10.5 },
      { id: "p7", nome: "Produto G", quantidadeDisponivel: 4, valorUnitario: 7.5 },
    ],
    data: "2024-06-09",
    observacoes: "Nota teste 9",
  },
  {
    id: "n10",
    numero: "10010",
    fornecedor: "Fornecedor X",
    produtos: [
      { id: "p2", nome: "Produto B", quantidadeDisponivel: 17, valorUnitario: 25.0 },
      { id: "p8", nome: "Produto H", quantidadeDisponivel: 3, valorUnitario: 22.0 },
    ],
    data: "2024-06-10",
    observacoes: "Nota teste 10",
  },
]; 