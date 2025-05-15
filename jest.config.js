// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Diretório onde está o next.config.js e os arquivos .env
  dir: './',
})

// Configurações personalizadas do Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Mapeia os alias definidos no tsconfig.json
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/service/(.*)$': '<rootDir>/src/service/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1', 
    '^@/contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  // Importante para o mock do localStorage funcionar corretamente
  resetMocks: false,
}

// createJestConfig é exportado para permitir que o next/jest carregue a configuração do Next.js
module.exports = createJestConfig(customJestConfig) 