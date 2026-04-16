# GP-2026 - IA & Gêmeo Digital
## Sistema Inteligente de Gestão de Acessibilidade e Inclusão

Um dashboard moderno e acessível para gerenciar relatos de dificuldades de acessibilidade, processos com IA Llama e ordens de serviço automáticas.

### Características

- **Interface do Colaborador**: Formulário inteligente para relatar dificuldades de acessibilidade
- **Processamento com IA**: Integração com Llama via Groq para análise de problemas
- **Gêmeo Digital**: Visualização 3D simulada de conflitos físicos
- **Gestão de Ordens de Serviço**: Sistema completo de OS com status e histórico
- **Alto Contraste**: Modo de acessibilidade com cores de alto contraste
- **Autenticação**: Sistema de login e registro com bcrypt e sessões
- **Roles de Acesso**: Separação entre Operadores e Administradores

### Stack Tecnológico

- **Frontend**: React + Next.js 16 + TypeScript
- **Estilo**: Tailwind CSS v4 + shadcn/ui
- **Backend**: Next.js API Routes
- **Banco de Dados**: MySQL (XAMPP/local)
- **IA**: Llama 3.3 70B via Groq API (fetch direto, sem SDK)
- **Autenticação**: Sessions com bcrypt

### Pré-requisitos

- Node.js 18+
- MySQL 8.0+ (XAMPP ou similar)
- Groq API Key (obtenha em https://console.groq.com)

---

## Configuração Rápida (XAMPP)

### 1. Iniciar o MySQL

Abra o XAMPP Control Panel e inicie o MySQL.

### 2. Criar o Banco de Dados

Abra o phpMyAdmin (http://localhost/phpmyadmin) e execute o conteúdo do arquivo:

```
scripts/create-database.sql
```

Ou via terminal MySQL:
```bash
mysql -u root < scripts/create-database.sql
```

### 3. Configurar Variáveis de Ambiente

O arquivo `.env.local` já está configurado para XAMPP padrão:

```env
# MySQL (XAMPP padrão)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=gp2026_acessibilidade

# Groq API (Llama)
GROQ_API_KEY=sua_chave_aqui
```

### 4. Criar Usuários Padrão

```bash
# Instalar dependências
npm install

# Criar usuários (admin e operador)
npm run create-users
```

### 5. Iniciar o Sistema

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## Credenciais de Acesso

| Tipo | Email | Senha |
|------|-------|-------|
| Administrador | admin@gp2026.com | admin123 |
| Operador | wanderson@gp2026.com | operador123 |

---

## Funcionalidades por Perfil

### Operador
- Relatar problemas de acessibilidade
- Consultar status da OS por protocolo
- Ver análise da IA
- Ver sugestões de solução

### Administrador
- Dashboard com métricas
- Listar todas as Ordens de Serviço
- Alterar status das OS
- Visualizar Gêmeo Digital (planta 3D)
- Gerenciar colaboradores
- Configurar parâmetros da IA

---

## Estrutura de Arquivos

```
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── registro/route.ts
│   │   ├── logout/route.ts
│   │   └── me/route.ts
│   └── ordens-servico/
│       ├── route.ts
│       ├── [id]/route.ts
│       ├── [id]/historico/route.ts
│       └── protocolo/[protocolo]/route.ts
├── admin/
│   ├── page.tsx              # Dashboard
│   ├── gemeo-digital/        # Mapa 3D
│   ├── colaboradores/        # Lista de colaboradores
│   └── configuracoes/        # Config IA
├── operador/
│   ├── page.tsx              # Formulário de relato
│   └── consulta/             # Consulta de OS
├── login/
├── registro/
└── page.tsx                  # Home pública

components/
├── auth/                     # Contexto e guards
├── dashboard/                # Componentes do sistema
└── ui/                       # shadcn/ui

lib/
├── auth.ts                   # Funções de autenticação
├── db.ts                     # Conexão MySQL
└── types.ts                  # TypeScript types

scripts/
├── create-database.sql       # Schema completo
├── create-users.js           # Criar usuários
└── setup-db.js               # Setup automático
```

---

## API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/registro` - Registro
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuário atual

### Ordens de Serviço
- `GET /api/ordens-servico` - Listar OS
- `POST /api/ordens-servico` - Criar OS (dispara IA)
- `GET /api/ordens-servico/:id` - Detalhes
- `PUT /api/ordens-servico/:id` - Atualizar status
- `GET /api/ordens-servico/:id/historico` - Histórico
- `GET /api/ordens-servico/protocolo/:protocolo` - Buscar por protocolo

---

## Fluxo de Análise com IA

1. **Operador relata problema**
   - Descreve a dificuldade encontrada
   - Informa setor e tipo de PCD

2. **IA Llama analisa**
   - Cruza perfil do colaborador
   - Consulta normas NBR 9050
   - Identifica barreiras físicas

3. **Sistema gera OS automática**
   - Protocolo único
   - Análise técnica
   - Sugestões de solução
   - Status: Encaminhado para Manutenção

4. **Admin gerencia**
   - Altera status
   - Visualiza no Gêmeo Digital
   - Registra histórico

---

## Troubleshooting

### Erro: "Can't connect to MySQL"
- Verifique se o MySQL do XAMPP está rodando
- Confirme as credenciais no `.env.local`

### Erro: "Table doesn't exist"
- Execute o script SQL: `scripts/create-database.sql`

### Erro: "Credenciais inválidas"
- Execute: `npm run create-users`

### Erro: "GROQ_API_KEY not found"
- Adicione sua chave Groq no `.env.local`

---

**Desenvolvido para acessibilidade e inclusão corporativa**
