# StockFlow - Sistema de Gerenciamento de Estoque

Um sistema web moderno para controle de entradas e saídas de estoque, desenvolvido com Next.js, React, TypeScript, Tailwind CSS e DaisyUI.

## Características

- 🔐 Sistema de autenticação completo
- 🌓 Tema claro/escuro
- 📱 Design responsivo para todas as telas
- 📦 Gestão de produtos
- 📋 Controle de entrada e saída de estoque
- 📊 Dashboard com visão geral
- 👤 Perfil de usuário personalizável
- 🏢 Gestão de fornecedores

## Tecnologias Utilizadas

- **Next.js** - Framework React para desenvolvimento web
- **React** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset tipado de JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **DaisyUI** - Componentes para Tailwind CSS

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/stock-flow.git

# Entrar no diretório
cd stock-flow

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

## Uso

Após iniciar o servidor de desenvolvimento, acesse `http://localhost:3000` no seu navegador.

### Credenciais de demonstração

- **Email**: admin@example.com
- **Senha**: password

## Estrutura do Projeto

```
src/
├── app/                   # Páginas e layouts Next.js
├── components/            # Componentes React reutilizáveis
│   └── ui/                # Componentes de interface
├── contexts/              # Contextos React (autenticação, tema)
├── hooks/                 # Hooks personalizados
└── service/               # Serviços e API
```

## Capturas de Tela

![Dashboard](screenshots/dashboard.png)
![Entrada de Estoque](screenshots/entrada-estoque.png)
![Perfil de Usuário](screenshots/perfil.png)

## Próximas Funcionalidades

- [ ] Relatórios avançados
- [ ] Exportação para PDF/Excel
- [ ] Controle de lotes e validade
- [ ] Aplicativo mobile

## Licença

MIT
