# Sistema de Gerenciamento de Inventário

## Visão Geral
Sistema completo de gerenciamento de inventário para servidor local, com autenticação em três níveis de permissão e gestão de três tipos de equipamentos.

## Estrutura do Projeto

### Backend (server/)
- **server/index.ts**: Ponto de entrada do servidor Express
- **server/routes.ts**: Todas as rotas da API REST
- **server/storage.ts**: Interface de armazenamento com implementação em memória
- **shared/schema.ts**: Schemas Drizzle ORM e validação Zod

### Frontend (client/src/)
- **App.tsx**: Componente principal com roteamento e autenticação
- **contexts/AuthContext.tsx**: Contexto de autenticação global
- **pages/**: Páginas principais da aplicação
  - Login.tsx: Tela de login
  - Dashboard.tsx: Dashboard com métricas
  - Inventario.tsx: Listagem e gerenciamento de equipamentos
  - CadastroEquipamento.tsx: Cadastro de novos equipamentos
  - Historico.tsx: Histórico de modificações
  - GestaoUsuarios.tsx: Gestão de usuários (apenas Admin)
- **components/**: Componentes reutilizáveis e formulários

## Funcionalidades Implementadas

### Autenticação
- Login com email e senha
- Três níveis de permissão:
  - **Admin**: Acesso total (CRUD de usuários, equipamentos, visualização completa)
  - **Suporte**: Gerenciamento de equipamentos (CRUD de equipamentos, sem gestão de usuários)
  - **Controle**: Apenas visualização de métricas no dashboard
- Persistência de sessão no localStorage
- Proteção de rotas baseada em perfil

### Gestão de Equipamentos
- Três tipos de equipamentos:
  - **Notebooks**: 20+ campos incluindo responsável, modelo, fornecedor, status, etc.
  - **Celulares**: Campos específicos como IMEI, número, emails de login/supervisão
  - **Terminais**: Campos como número do relógio, status, status next
- CRUD completo para todos os tipos
- Filtros avançados: busca, status, UF, segmento, fornecedor
- Visualização em abas (Todos, Notebooks, Celulares, Terminais)
- Confirmação de exclusão com AlertDialog

### Dashboard
- Métricas em tempo real:
  - Total de equipamentos
  - Distribuição por status
  - Distribuição por UF
  - Distribuição por segmento
  - Distribuição por fornecedor (notebooks)
- Gráficos interativos com Recharts

### Histórico
- Registro automático de todas as modificações
- Três tipos de ação: criação, edição, exclusão
- Filtros por data (inicial/final) e tipo de ação
- Timeline visual com detalhes de usuário, timestamp e equipamento

### Gestão de Usuários (Admin apenas)
- Listar todos os usuários
- Criar novos usuários com nome, email, senha e perfil
- Alternar status ativo/inativo
- Excluir usuários
- Validação de email único

## API Endpoints

### Autenticação
- `POST /api/auth/login`: Login de usuário

### Usuários
- `GET /api/users`: Listar todos os usuários
- `GET /api/users/:id`: Buscar usuário por ID
- `POST /api/users`: Criar novo usuário
- `PATCH /api/users/:id`: Atualizar usuário
- `DELETE /api/users/:id`: Excluir usuário

### Notebooks
- `GET /api/notebooks`: Listar todos os notebooks
- `GET /api/notebooks/:id`: Buscar notebook por ID
- `POST /api/notebooks`: Criar novo notebook
- `PATCH /api/notebooks/:id`: Atualizar notebook
- `DELETE /api/notebooks/:id`: Excluir notebook

### Celulares
- `GET /api/celulares`: Listar todos os celulares
- `GET /api/celulares/:id`: Buscar celular por ID
- `POST /api/celulares`: Criar novo celular
- `PATCH /api/celulares/:id`: Atualizar celular
- `DELETE /api/celulares/:id`: Excluir celular

### Terminais
- `GET /api/terminais`: Listar todos os terminais
- `GET /api/terminais/:id`: Buscar terminal por ID
- `POST /api/terminais`: Criar novo terminal
- `PATCH /api/terminais/:id`: Atualizar terminal
- `DELETE /api/terminais/:id`: Excluir terminal

### Histórico
- `GET /api/historico`: Listar todo o histórico
- `GET /api/historico/equipment/:equipmentId`: Histórico de um equipamento específico

### Dashboard
- `GET /api/dashboard/stats`: Estatísticas agregadas do inventário

## Usuário Padrão
- **Email**: admin@opus.com
- **Senha**: opus@@2025$%
- **Perfil**: Admin

## Status dos Equipamentos
- **EM USO**: Verde (Equipamento em uso ativo)
- **DEVOLVER**: Laranja (Equipamento a ser devolvido)
- **CORREIO**: Azul (Equipamento em trânsito)
- **GUARDADO**: Cinza (Equipamento armazenado)
- **TROCA**: Roxo (Equipamento para troca - apenas terminais)

## Fornecedores (Notebooks)
- MAGNA
- OPUS
- ONLY
- ALLU

## Tecnologias
- **Frontend**: React, TypeScript, Wouter (routing), TanStack Query, shadcn/ui
- **Backend**: Express.js, TypeScript
- **Validação**: Zod, drizzle-zod
- **ORM**: Drizzle ORM (com PostgreSQL configurado, mas usando storage em memória)
- **Estilo**: Tailwind CSS com design system customizado

## Design System
- Paleta de cores baseada em Material Design com abordagem enterprise
- Componentes shadcn/ui customizados
- Sistema de sidebar responsivo
- Dark mode não implementado (apenas light mode)
- Design guidelines em `design_guidelines.md`

## Estado Atual
✅ Backend completo com todas as rotas implementadas
✅ Frontend totalmente integrado com APIs
✅ Sistema de autenticação funcional
✅ CRUD completo para todos os tipos de equipamentos
✅ Histórico automático de modificações
✅ Dashboard com dados em tempo real
✅ Gestão de usuários (Admin)
✅ Validação de formulários
✅ Confirmações de exclusão
✅ Filtros e busca avançada
✅ Interface totalmente em português do Brasil

## Próximos Passos Sugeridos
- Migrar storage em memória para PostgreSQL usando Drizzle ORM
- Implementar edição de equipamentos (atualmente em desenvolvimento)
- Adicionar visualização detalhada de equipamentos
- Implementar edição de perfil de usuário
- Adicionar paginação para grandes listas
- Implementar exportação de dados (CSV/Excel)
- Adicionar gráficos adicionais no dashboard
- Implementar notificações para ações importantes
- Adicionar funcionalidade de impressão de termos
