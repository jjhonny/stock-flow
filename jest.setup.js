import '@testing-library/jest-dom';
import 'jest-localstorage-mock';

// Suprime os erros de console durante os testes para manter a saída limpa
// (Opcional, mas recomendado para evitar logs desnecessários)
global.console = {
  ...console,
  // Descomente se quiser suprimir mensagens de erro/aviso durante os testes
  // error: jest.fn(),
  // warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock para ResizeObserver que é frequentemente usado em componentes React modernos
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock; 