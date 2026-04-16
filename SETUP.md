# 🚀 Guia Rápido de Setup - GP-2026

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 18+** ([baixar](https://nodejs.org))
- **MySQL 8.0+** ([baixar](https://www.mysql.com/downloads/))
- **Git** (opcional)

## 📝 Passo 1: Clonar/Copia o Projeto

```bash
# Se usando Git
git clone <seu-repositorio>
cd gp-2026

# Ou copie os arquivos manualmente
cd gp-2026
```

## 📦 Passo 2: Instalar Dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

## 🗄️ Passo 3: Configurar Banco de Dados

### 3.1 Criar arquivo `.env.local`

Na raiz do projeto, crie um arquivo chamado `.env.local`:

```env
# ===== MySQL Configuration =====
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=sua_senha_mysql
MYSQL_DATABASE=gp_2026

# ===== Groq API (Llama) =====
GROQ_API_KEY=sua_chave_api_groq
```

### 3.2 Obter Groq API Key

1. Acesse https://console.groq.com
2. Crie uma conta ou faça login
3. Gere uma nova API Key
4. Copie para `.env.local`

### 3.3 Executar Setup do Banco

```bash
# Opção 1: Usar script Node.js (recomendado - automático)
node scripts/setup-db.js

# Opção 2: Usar MySQL CLI (manual)
mysql -h localhost -u root -p gp_2026 < scripts/create-database.sql

# Opção 3: Importar via MySQL Workbench ou phpMyAdmin
# - Abra create-database.sql
# - Execute no seu banco de dados
```

**Saída esperada:**
```
🔗 Conectando ao MySQL...
✅ Conectado ao MySQL
📊 Criando banco de dados: gp_2026
✅ Banco de dados criado/verificado
📝 Executando 4 declarações SQL...
   └─ Criando tabela: ordens_servico
   └─ Criando tabela: historico_os
   └─ Criando tabela: normas_nbr
✅ Todas as tabelas criadas com sucesso!
✨ Setup do banco de dados concluído com sucesso!
```

## 🎮 Passo 4: Iniciar o Servidor

```bash
npm run dev
```

**Saída esperada:**
```
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  ✓ Ready in 1.5s
```

## 🌐 Passo 5: Acessar o Sistema

### 🏠 Página Inicial
- **URL**: http://localhost:3000
- **Descrição**: Página de bem-vindo com informações do sistema

### 👷 Interface do Operador
- **URL**: http://localhost:3000/operador
- **Username**: `operador` (qualquer entrada funciona)
- **Funcionalidade**: 
  - Relatar dificuldades de acessibilidade
  - Consultar status das suas OS

### 👨‍💼 Interface do Administrador
- **URL**: http://localhost:3000/admin
- **Username**: `admin` (qualquer entrada funciona)
- **Funcionalidade**:
  - Gerenciar todas as OS
  - Ver análises da IA
  - Alterar status das OS
  - Visualizar Gêmeo Digital
  - Gerenciar Colaboradores
  - Configurar parâmetros da IA

## 🧪 Testando o Sistema

### Criar uma Nova OS (Operador)

1. Vá para http://localhost:3000/operador
2. Preencha o formulário:
   - **Nome**: Seu nome
   - **Tipo de Deficiência**: Escolha uma opção
   - **Descrição**: Descreva o problema
   
   Exemplo:
   ```
   Nome: Wanderson
   Tipo: Deficiência Motora (Cadeirante)
   Descrição: Sou cadeirante e não consigo alcançar os materiais nas prateleiras altas da Copa. As prateleiras estão a aproximadamente 1,60m de altura.
   ```

3. Clique em "Enviar para Análise"
4. A IA processará e gerará uma OS automaticamente

### Gerenciar OS (Administrador)

1. Vá para http://localhost:3000/admin
2. Veja a lista de OS criadas
3. Clique em uma OS para ver detalhes
4. Altere o status conforme necessário:
   - Rascunho → Encaminhado → Em Análise → Em Execução → Concluído

### Ver Gêmeo Digital

1. No admin, vá para "Mapa 3D (Gêmeo Digital)"
2. Visualize a planta baixa com os conflitos de acessibilidade destacados

## 🎨 Ativar Modo Alto Contraste

1. No menu superior, procure por "Contraste"
2. Clique para ativar modo de alto contraste
3. As cores mudarão para contraste máximo

## 📊 Exemplo de Fluxo Completo

```
1. OPERADOR relata problema
   ↓
2. SISTEMA processa com IA Llama
   ↓
3. IA analisa NBR 9050 e tipo de deficiência
   ↓
4. OS é criada automaticamente
   ↓
5. ADMIN vê OS no dashboard
   ↓
6. ADMIN muda status para "Em Execução"
   ↓
7. OPERADOR consulta status via número do protocolo
   ↓
8. ADMIN marca como "Concluído"
   ↓
9. OPERADOR vê conclusão
```

## 🐛 Troubleshooting

### ❌ Erro: "Can't connect to MySQL server"

```bash
# Verifique se MySQL está rodando
mysql -h localhost -u root -p

# No Mac (com Homebrew):
brew services start mysql

# No Windows (Services):
# Procure por "MySQL" em Serviços e inicie

# No Linux:
sudo systemctl start mysql
```

### ❌ Erro: "Access denied for user 'root'@'localhost'"

Verifique as credenciais em `.env.local`:
```env
MYSQL_PASSWORD=sua_senha_correta
```

### ❌ Erro: "GROQ_API_KEY is not set"

1. Abra `.env.local`
2. Adicione: `GROQ_API_KEY=sua_chave_aqui`
3. Reinicie o servidor: `Ctrl+C` e `npm run dev`

### ❌ Erro: "Table 'gp_2026.ordens_servico' doesn't exist"

Execute novamente:
```bash
node scripts/setup-db.js
```

### ❌ Página em branco ou erro 500

Verifique os logs:
```bash
# No terminal onde rodou `npm run dev`
# Procure por mensagens de erro
```

### ❌ IA não responde

1. Verifique se a API Key é válida
2. Verifique internet (Groq precisa de conexão)
3. Verifique quota de requisições em https://console.groq.com

## 📚 Estrutura de Pastas

```
gp-2026/
├── app/                    # Páginas Next.js
│   ├── api/               # Rotas da API
│   ├── operador/          # Interface operador
│   ├── admin/             # Interface admin
│   └── page.tsx           # Home
├── components/            # Componentes React
│   └── dashboard/         # Componentes do dashboard
├── lib/                   # Utilitários
│   ├── db.ts             # Conexão MySQL
│   └── types.ts          # Types TypeScript
├── scripts/              # Scripts de setup
│   ├── create-database.sql
│   └── setup-db.js
├── .env.local           # Variáveis de ambiente (criar)
├── .env.example         # Exemplo de variáveis
└── README.md           # Documentação completa
```

## 🎯 Próximos Passos

- [ ] Completar setup do banco de dados
- [ ] Configurar Groq API Key
- [ ] Testar criação de OS
- [ ] Explorar o Gêmeo Digital
- [ ] Personalizar parâmetros da IA
- [ ] Customizar logo e cores (Design Mode no v0)

## 💡 Dicas Úteis

- **Protocolo das OS**: Gerado automaticamente (EX: GP-2026-001)
- **Simular outros usuários**: Use nomes diferentes na coluna "Seu Nome"
- **Ver logs da IA**: Clique em "Ver Análise Técnica" em uma OS
- **Backup do banco**: Execute `mysqldump -u root -p gp_2026 > backup.sql`

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do terminal
2. Consulte a seção de Troubleshooting acima
3. Revise as variáveis de ambiente
4. Tente reiniciar: `Ctrl+C` e `npm run dev`

---

**Pronto para começar? 🚀**

Execute os passos acima e acesse http://localhost:3000
