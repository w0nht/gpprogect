import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'gp_2026',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function setupDatabase() {
  let connection;

  try {
    console.log('🔗 Conectando ao MySQL...');
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    console.log('✅ Conectado ao MySQL');

    // Create database if not exists
    console.log(`📊 Criando banco de dados: ${dbConfig.database}`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    console.log('✅ Banco de dados criado/verificado');

    // Switch to the database
    await connection.execute(`USE ${dbConfig.database}`);

    // Read SQL script
    const sqlPath = path.join(__dirname, 'create-database.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = sqlScript
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    console.log(`📝 Executando ${statements.length} declarações SQL...`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt.toLowerCase().includes('create table')) {
        const tableName = stmt.match(/create table if not exists (\w+)/i)?.[1];
        console.log(`   └─ Criando tabela: ${tableName}`);
      }
      await connection.execute(stmt);
    }

    console.log('✅ Todas as tabelas criadas com sucesso!');

    // Insert sample data (normas NBR)
    console.log('📥 Inserindo dados de referência (NBR 9050)...');

    await connection.execute(`
      INSERT IGNORE INTO normas_nbr (titulo, descricao, alturas_acessibilidade, profundidade_alcance)
      VALUES (
        'NBR 9050:2020 - Acessibilidade a edificações',
        'Norma técnica brasileira que estabelece critérios e parâmetros técnicos para acessibilidade.',
        '{"minima": 0.40, "maxima": 1.20, "ideal": 0.80, "unidade": "metros"}',
        1.25
      )
    `);

    console.log('✅ Dados de referência inseridos');

    // Verify tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📋 Tabelas criadas:');
    tables.forEach((row, index) => {
      const tableName = Object.values(row)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });

    console.log('\n✨ Setup do banco de dados concluído com sucesso!');
    console.log('\n📌 Próximos passos:');
    console.log('   1. Configure as variáveis de ambiente em .env.local');
    console.log('   2. Adicione GROQ_API_KEY para a integração com IA');
    console.log('   3. Execute: npm run dev');

  } catch (error) {
    console.error('❌ Erro durante setup:', error.message);
    console.error('\nDicas de troubleshooting:');
    console.error('  • Verifique se MySQL está rodando');
    console.error('  • Verifique credenciais de banco (.env.local)');
    console.error('  • Verifique permissões do usuário MySQL');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexão fechada');
    }
  }
}

// Run setup
setupDatabase();
