import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SaidaEstoque from './page';
import { getNotas, updateNotas, NotaEntrada, ProdutoItem } from '@/service/notaService';
import { saveSaida } from '@/service/saidaService';

// Mock de libs externas e hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
  })),
}));

// Mock dos serviços
jest.mock('@/service/notaService', () => ({
  getNotas: jest.fn(),
  updateNotas: jest.fn(),
  NotaEntrada: jest.fn(),
  ProdutoItem: jest.fn(),
}));

jest.mock('@/service/saidaService', () => ({
  saveSaida: jest.fn(),
}));

// Mock do Toast
const mockShowToast = jest.fn();
jest.mock('@/components/Toast', () => ({
  useToast: jest.fn(() => ({
    showToast: mockShowToast,
  })),
}));

// Dados de exemplo para os testes
const mockNotasEntrada: NotaEntrada[] = [
  {
    id: '1',
    numero: '001',
    fornecedor: 'Fornecedor Teste',
    data: '2023-01-01',
    produtos: [
      {
        id: 'p1',
        nome: 'Produto 1',
        quantidadeDisponivel: 10,
        valorUnitario: 100,
      },
      {
        id: 'p2',
        nome: 'Produto 2',
        quantidadeDisponivel: 0, // Produto sem disponibilidade
        valorUnitario: 50,
      },
    ],
    observacoes: 'Observação teste',
  },
  {
    id: '2',
    numero: '002',
    fornecedor: 'Outro Fornecedor',
    data: '2023-01-02',
    produtos: [
      {
        id: 'p3',
        nome: 'Produto 3',
        quantidadeDisponivel: 5,
        valorUnitario: 75,
      },
    ],
  },
];

// Configuração comum para todos os testes
beforeEach(() => {
  // Limpa mocks antes de cada teste
  jest.clearAllMocks();
  localStorage.clear();
  
  // Configura o mock de getNotas para retornar os dados de exemplo
  (getNotas as jest.Mock).mockReturnValue(mockNotasEntrada);
  
  // Configuração da data atual para ser determinística nos testes
  jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('2023-01-10').getTime());
  
  // Reset dos mocks
  mockShowToast.mockClear();
});

afterEach(() => {
  // Restaura a implementação original de Date.now
  jest.restoreAllMocks();
});

describe('Componente SaidaEstoque', () => {
  describe('Renderização Inicial', () => {
    test('Deve renderizar o título principal "Saída de Estoque"', () => {
      render(<SaidaEstoque />);
      expect(screen.getByText('Saída de Estoque')).toBeInTheDocument();
    });

    test('Deve renderizar o botão "Voltar"', () => {
      render(<SaidaEstoque />);
      expect(screen.getByText('Voltar')).toBeInTheDocument();
    });

    test('Deve renderizar os cards "Informações da Saída", "Produtos da Nota" e "Resumo da Saída"', () => {
      render(<SaidaEstoque />);
      expect(screen.getByText('Informações da Saída')).toBeInTheDocument();
      expect(screen.getByText('Produtos da Nota')).toBeInTheDocument();
      expect(screen.getByText('Resumo da Saída')).toBeInTheDocument();
    });

    test('Deve mostrar mensagem "Selecione uma nota para ver os produtos" na tabela de produtos', () => {
      render(<SaidaEstoque />);
      expect(screen.getByText('Selecione uma nota para ver os produtos')).toBeInTheDocument();
    });

    test('Deve mostrar mensagem "Nenhum produto adicionado à saída" no resumo', () => {
      render(<SaidaEstoque />);
      expect(screen.getByText('Nenhum produto adicionado à saída')).toBeInTheDocument();
    });

    test('O botão "Finalizar Saída" deve estar inicialmente desabilitado', () => {
      render(<SaidaEstoque />);
      const finalizarButton = screen.getByText('Finalizar Saída');
      expect(finalizarButton).toBeInTheDocument();
      expect(finalizarButton).toBeDisabled();
    });
  });

  describe('Interação com Campos do Formulário', () => {
    test('Deve atualizar o estado ao selecionar uma nota e mostrar seus produtos', async () => {
      render(<SaidaEstoque />);
      
      // Seleciona uma nota no dropdown
      const selectElement = screen.getByLabelText('Nota de Entrada');
      await userEvent.selectOptions(selectElement, '1');
      
      // Verifica se a tabela de produtos é atualizada
      expect(screen.getByText('Produto 1')).toBeInTheDocument();
      expect(screen.queryByText('Selecione uma nota para ver os produtos')).not.toBeInTheDocument();
    });

    test('Deve atualizar o estado ao mudar a data da saída', async () => {
      render(<SaidaEstoque />);
      
      const dateInput = screen.getByLabelText('Data da Saída');
      await userEvent.clear(dateInput);
      await userEvent.type(dateInput, '2023-02-15');
      
      expect(dateInput).toHaveValue('2023-02-15');
    });

    test('Deve atualizar o estado ao digitar o motivo da saída', async () => {
      render(<SaidaEstoque />);
      
      const motivoInput = screen.getByLabelText('Motivo da Saída');
      await userEvent.type(motivoInput, 'Teste de motivo');
      
      expect(motivoInput).toHaveValue('Teste de motivo');
    });

    test('Deve atualizar o estado ao digitar o destinatário', async () => {
      render(<SaidaEstoque />);
      
      const destinatarioInput = screen.getByLabelText('Destinatário (opcional)');
      await userEvent.type(destinatarioInput, 'Empresa Teste');
      
      expect(destinatarioInput).toHaveValue('Empresa Teste');
    });

    test('Deve atualizar o estado ao digitar observações', async () => {
      render(<SaidaEstoque />);
      
      const observacoesInput = screen.getByLabelText('Observações');
      await userEvent.type(observacoesInput, 'Observações de teste');
      
      expect(observacoesInput).toHaveValue('Observações de teste');
    });
  });

  describe('Seleção de Produtos e Manuseio de Quantidade', () => {
    test('Quando uma nota é selecionada, a tabela de produtos deve ser populada', async () => {
      render(<SaidaEstoque />);
      
      // Seleciona uma nota
      const selectElement = screen.getByLabelText('Nota de Entrada');
      await userEvent.selectOptions(selectElement, '1');
      
      // Verifica se a tabela foi populada corretamente
      expect(screen.getByText('Produto 1')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument(); // quantidadeDisponivel
      expect(screen.getByText('Produto 2')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // Produto 2 com estoque zero
    });

    test('Deve atualizar quantidadesSaida ao alterar a quantidade de um produto', async () => {
      render(<SaidaEstoque />);
      
      // Seleciona uma nota para mostrar produtos
      const selectElement = screen.getByLabelText('Nota de Entrada');
      await userEvent.selectOptions(selectElement, '1');
      
      // Encontra o input de quantidade e altera seu valor
      const quantidadeInput = screen.getAllByRole('spinbutton')[0]; // Primeiro input de quantidade
      await userEvent.clear(quantidadeInput);
      await userEvent.type(quantidadeInput, '5');
      
      expect(quantidadeInput).toHaveValue(5);
    });

    test('Ao clicar em "Dar Saída" com quantidade válida, deve adicionar o produto a itensSaida', async () => {
      render(<SaidaEstoque />);
      
      // Seleciona uma nota
      const selectElement = screen.getByLabelText('Nota de Entrada');
      await userEvent.selectOptions(selectElement, '1');
      
      // Altera a quantidade
      const quantidadeInput = screen.getAllByRole('spinbutton')[0];
      await userEvent.clear(quantidadeInput);
      await userEvent.type(quantidadeInput, '5');
      
      // Clica em "Dar Saída"
      const darSaidaButton = screen.getByTestId('dar-saida-p1');
      await userEvent.click(darSaidaButton);
      
      // Verifica se o produto foi adicionado ao resumo
      const textElements = screen.getAllByText('Produto 1');
      expect(textElements.length).toBeGreaterThan(0);
      
      expect(mockShowToast).toHaveBeenCalledWith('Produto adicionado à saída!', 'success');
      
      // O botão "Dar Saída" e o input devem estar desabilitados
      expect(darSaidaButton).toBeDisabled();
      expect(quantidadeInput).toBeDisabled();
    });

    test('Ao clicar em "Dar Saída" com quantidade inválida, deve mostrar erro', async () => {
      render(<SaidaEstoque />);
      
      // Seleciona uma nota
      const selectElement = screen.getByLabelText('Nota de Entrada');
      await userEvent.selectOptions(selectElement, '1');
      
      // Define uma quantidade inválida (maior que a disponível)
      const quantidadeInput = screen.getAllByRole('spinbutton')[0];
      await userEvent.clear(quantidadeInput);
      await userEvent.type(quantidadeInput, '15'); // Maior que 10 disponíveis
      
      // Clica em "Dar Saída"
      const darSaidaButton = screen.getByTestId('dar-saida-p1');
      await userEvent.click(darSaidaButton);
      
      // Verifica se o toast de erro foi exibido
      expect(mockShowToast).toHaveBeenCalledWith('Quantidade inválida para o produto selecionado', 'error');
      
      // O produto não deve ser adicionado ao resumo
      expect(screen.getByText('Nenhum produto adicionado à saída')).toBeInTheDocument();
    });

    test('Ao clicar no botão remover, deve remover o item de itensSaida', async () => {
      render(<SaidaEstoque />);
      
      // Seleciona uma nota e adiciona um produto
      const selectElement = screen.getByLabelText('Nota de Entrada');
      await userEvent.selectOptions(selectElement, '1');
      
      const quantidadeInput = screen.getAllByRole('spinbutton')[0];
      await userEvent.clear(quantidadeInput);
      await userEvent.type(quantidadeInput, '5');
      
      const darSaidaButton = screen.getByTestId('dar-saida-p1');
      await userEvent.click(darSaidaButton);
      
      // Verifica se o produto foi adicionado
      expect(screen.queryByText('Nenhum produto adicionado à saída')).not.toBeInTheDocument();
      
      // Clica no botão de remover
      const removeButton = screen.getByRole('button', { name: '' }); // Botão com ícone FaTimes
      await userEvent.click(removeButton);
      
      // Verifica se o produto foi removido
      expect(screen.getByText('Nenhum produto adicionado à saída')).toBeInTheDocument();
      
      // O botão "Dar Saída" e o input devem estar habilitados novamente
      const updatedDarSaidaButton = screen.getByTestId('dar-saida-p1');
      const updatedQuantidadeInput = screen.getAllByRole('spinbutton')[0];
      expect(updatedDarSaidaButton).not.toBeDisabled();
      expect(updatedQuantidadeInput).not.toBeDisabled();
    });
  });

  describe('Submissão do Formulário (handleSubmit)', () => {
    test('Não deve submeter se o motivo estiver vazio', async () => {
      render(<SaidaEstoque />);
      
      // Seleciona uma nota
      const selectElement = screen.getByLabelText('Nota de Entrada');
      await userEvent.selectOptions(selectElement, '1');
      
      // Adiciona um produto
      const quantidadeInput = screen.getAllByRole('spinbutton')[0];
      await userEvent.clear(quantidadeInput);
      await userEvent.type(quantidadeInput, '5');
      
      const darSaidaButton = screen.getByTestId('dar-saida-p1');
      await userEvent.click(darSaidaButton);
      
      // Tenta submeter sem preencher o motivo
      const submitButton = screen.getByText('Finalizar Saída');
      await userEvent.click(submitButton);
      
      // Verifica se o toast é exibido (sem verificar a mensagem exata)
      expect(mockShowToast).toHaveBeenCalled();
      
      // Os serviços não devem ser chamados
      expect(updateNotas).not.toHaveBeenCalled();
      expect(saveSaida).not.toHaveBeenCalled();
    });

    test('Submissão bem-sucedida deve chamar os serviços corretamente', async () => {
      // Mock para Date.now usado na geração de ID
      const mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(12345);
      const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.6789);
      
      render(<SaidaEstoque />);
      
      // Seleciona uma nota
      const selectElement = screen.getByLabelText('Nota de Entrada');
      await userEvent.selectOptions(selectElement, '1');
      
      // Preenche o motivo e destinatário
      const motivoInput = screen.getByLabelText('Motivo da Saída');
      await userEvent.type(motivoInput, 'Teste de motivo');
      
      const destinatarioInput = screen.getByLabelText('Destinatário (opcional)');
      await userEvent.type(destinatarioInput, 'Empresa Teste');
      
      // Adiciona um produto
      const quantidadeInput = screen.getAllByRole('spinbutton')[0];
      await userEvent.clear(quantidadeInput);
      await userEvent.type(quantidadeInput, '5');
      
      const darSaidaButton = screen.getByTestId('dar-saida-p1');
      await userEvent.click(darSaidaButton);
      
      // Submete o formulário
      const submitButton = screen.getByText('Finalizar Saída');
      await userEvent.click(submitButton);
      
      // Verifica se os serviços foram chamados
      expect(updateNotas).toHaveBeenCalled();
      expect(saveSaida).toHaveBeenCalled();
      
      // Verifica se o toast de sucesso foi exibido
      expect(mockShowToast).toHaveBeenCalledWith('Saída de estoque registrada com sucesso!', 'success');
      
      // Restaura os mocks
      mockDateNow.mockRestore();
      mockRandom.mockRestore();
    });
  });

  describe('Funcionalidade do Botão Voltar', () => {
    test('Deve chamar router.back() ao clicar no botão Voltar', async () => {
      const { useRouter } = require('next/navigation');
      const mockBack = jest.fn();
      
      (useRouter as jest.Mock).mockReturnValue({
        push: jest.fn(),
        back: mockBack,
      });
      
      render(<SaidaEstoque />);
      
      // Clica no botão Voltar
      const voltarButton = screen.getByText('Voltar');
      await userEvent.click(voltarButton);
      
      // Verifica se router.back() foi chamado
      expect(mockBack).toHaveBeenCalled();
    });
  });
}); 