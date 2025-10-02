# Guia de Gerenciamento do Banco de Dados

## Visão Geral

O sistema agora usa um banco de dados PostgreSQL real para armazenar todos os dados. Este guia explica como gerenciar, exportar e importar dados.

## Estrutura do Banco de Dados

O banco de dados contém as seguintes tabelas:

- **users** - Usuários do sistema
- **notebooks** - Equipamentos tipo notebook
- **celulares** - Equipamentos tipo celular
- **terminais** - Equipamentos tipo terminal
- **historico** - Histórico de modificações

## Comandos Disponíveis

### 1. Aplicar Migrações (Criar/Atualizar Tabelas)

```bash
npm run db:push
```

Este comando sincroniza o schema do Drizzle ORM com o banco de dados. Use sempre que modificar `shared/schema.ts`.

Se houver aviso de perda de dados, use:
```bash
npm run db:push --force
```

### 2. Popular Banco com Usuário Admin

```bash
npm run db:seed
```

Cria o usuário admin padrão:
- **Email**: admin@opus.com
- **Senha**: opus@@2025$%

### 3. Exportar Banco de Dados

```bash
npm run db:export
```

Cria um backup completo (dados em formato JSON) em `backups/database_export_TIMESTAMP.json`

Este arquivo contém:
- Todos os usuários
- Todos os notebooks
- Todos os celulares
- Todos os terminais
- Todo o histórico

### 4. Importar Banco de Dados

```bash
npm run db:import <arquivo.json>
```

Importa dados de um arquivo JSON para o banco de dados atual. 

**IMPORTANTE**: Este comando **adiciona** dados ao banco sem sobrescrever. Registros com IDs duplicados serão ignorados.

## Exportar para Servidor Local

### Passo a Passo Completo:

1. **No Replit** - Exporte os dados:
```bash
npm run db:export
```

2. **Copie o arquivo** gerado em `backups/database_export_TIMESTAMP.json` para seu servidor local

3. **No servidor local** - Clone o projeto e configure:
```bash
git clone <seu-repositorio>
cd <projeto>
npm install
```

4. **Configure a conexão** com seu banco de dados PostgreSQL local:
```bash
# Crie um arquivo .env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_banco
```

5. **Crie as tabelas** no banco local:
```bash
npm run db:push
```

6. **Importe os dados**:
```bash
npm run db:import backups/database_export_TIMESTAMP.json
```

Pronto! Seu servidor local agora tem todos os dados.

## Conectar a um Servidor PostgreSQL Externo

### 1. Configurar Variável de Ambiente

Edite o arquivo `.env` (ou configure nas variáveis de ambiente do Replit):

```
DATABASE_URL=postgresql://usuario:senha@seu-servidor:5432/nome_banco
```

### 2. Aplicar Schema

```bash
npm run db:push
```

### 3. Popular com Admin

```bash
npm run db:seed
```

### 4. Reiniciar Servidor

O sistema agora estará conectado ao seu banco de dados externo.

## Backup Automático (Recomendado)

Para servidores de produção, recomenda-se configurar backups automáticos:

### No Linux/Mac (via cron):

1. Crie um script de backup `backup.sh`:
```bash
#!/bin/bash
cd /caminho/para/projeto
npm run db:export
# Opcional: enviar para backup externo
# rsync -av backups/ usuario@servidor:/caminho/backups/
```

2. Adicione ao crontab para executar diariamente às 2h:
```bash
crontab -e
# Adicione esta linha:
0 2 * * * /caminho/para/backup.sh
```

### No Windows (via Task Scheduler):

1. Crie um arquivo `backup.bat`:
```bat
@echo off
cd C:\caminho\para\projeto
call npm run db:export
rem Opcional: copiar para outro local
rem xcopy /Y backups\*.json D:\Backups\
```

2. Configure no Agendador de Tarefas:
   - Abra "Agendador de Tarefas"
   - Criar Tarefa Básica
   - Configure para executar diariamente
   - Ação: Iniciar programa `C:\caminho\para\backup.bat`

## Restaurar de Backup

1. Localize o arquivo de backup JSON em `backups/`

2. Execute o comando de importação:
```bash
npm run db:import backups/database_export_YYYY-MM-DD_HHMMSS.json
```

**Nota**: A importação adiciona dados sem sobrescrever. Registros duplicados são ignorados.

## Troubleshooting

### Erro: "relation already exists"

O schema já existe. Apenas importe os dados usando `npm run db:import`.

### Erro: "permission denied"

Certifique-se de que o usuário do banco de dados tem permissões adequadas:
```sql
GRANT ALL PRIVILEGES ON DATABASE nome_banco TO usuario;
```

### Dados não aparecem após importar

Verifique se:
1. O arquivo foi importado sem erros
2. As tabelas existem: `\dt` no psql
3. Os dados foram inseridos: `SELECT COUNT(*) FROM users;`

## Estrutura de Arquivos

```
project/
├── server/
│   ├── db.ts              # Configuração do Drizzle
│   ├── storage.ts         # Interface de acesso ao banco
│   └── seed.ts            # Script de população inicial
├── shared/
│   └── schema.ts          # Definição do schema (tabelas)
├── scripts/
│   ├── export-data.ts     # Script de exportação (TypeScript)
│   └── import-data.ts     # Script de importação (TypeScript)
└── backups/               # Diretório de backups (criado automaticamente)
```

## Notas Importantes

- ⚠️ **Segurança**: Adicione `backups/` ao `.gitignore` para não commitar dados sensíveis
- ⚠️ **Senhas**: As senhas são armazenadas em texto simples. Em produção, implemente hash (bcrypt/argon2)
- ⚠️ **Testes**: Sempre teste importações em ambiente de desenvolvimento primeiro
- ⚠️ **Backups**: Crie backups antes de fazer alterações significativas no schema
- ✅ **Timestamps**: Os arquivos de backup incluem data/hora automaticamente
- ✅ **Formato JSON**: Fácil de visualizar, editar e debugar se necessário
- ✅ **Portabilidade**: Arquivos JSON funcionam em qualquer ambiente com Node.js
