import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Carrega as variáveis do .env.local
dotenv.config({ path: '.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT || '3306'), // Crucial para Railway
};

async function setupDatabase() {
  let connection;

  try {
    console.log(`🔗 Conectando ao MySQL do Railway (${dbConfig.host}:${dbConfig.port})...`);
    
    // Conexão inicial para criar o banco (se necessário)
    // No Railway, o banco 'railway' geralmente já existe, mas mantemos por segurança
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
      // CONFIGURAÇÕES DE SEGURANÇA PARA RAILWAY:
      allowPublicKeyRetrieval: true, 
      ssl: {
        rejectUnauthorized: false // Permite conectar sem validar o certificado da CA
      }
    });

    console.log('✅ Conectado com sucesso ao Railway');

    // Cria o banco se não existir (O Railway costuma já dar um chamado 'railway')
    console.log(`📊 Verificando banco de dados: ${dbConfig.database}`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    
    // Seleciona o banco
    await connection.execute(`USE ${dbConfig.database}`);

    // Lê o script SQL
    const sqlPath = path.join(__dirname, 'create-database.sql');
    if (!fs.existsSync(sqlPath)) {
        throw new Error(`Arquivo SQL não encontrado em: ${sqlPath}`);
    }
    const sqlScript = fs.readFileSync(sqlPath, 'utf-8');

    // Executa os comandos
    const statements = sqlScript
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    console.log(`📝 Executando ${statements.length} comandos no banco remoto...`);

    for (const stmt of statements) {
      if (stmt.toLowerCase().includes('create table')) {
        console.log(`   └─ Sincronizando tabela...`);
      }
      await connection.execute(stmt);
    }

    // Inserção de dados NBR 9050 (O "Cérebro" do projeto)
    console.log('📥 Alimentando o cérebro da IA (Normas NBR 9050)...');
    await connection.execute(`
      INSERT IGNORE INTO normas_nbr (titulo, descricao, alturas_acessibilidade, profundidade_alcance)
      VALUES (
        'NBR 9050:2020 - Acessibilidade a edificações',
        'Norma técnica brasileira que estabelece critérios e parâmetros técnicos para acessibilidade.',
        '{"minima": 0.40, "maxima": 1.20, "ideal": 0.80, "unidade": "metros"}',
        1.25
      )
    `);

    console.log('✨ Setup GP-2026 concluído no Railway!');

  } catch (error) {
    console.error('❌ Erro no setup do Railway:', error.message);
    console.log('\n💡 DICA: Verifique se a porta no .env.local é 48264 e não 3306.');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexão encerrada.');
    }
  }
}

setupDatabase();