import mysql from 'mysql2/promise';

// Configuração do Pool (usando as variáveis do .env que configuramos)
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false // Necessário para o Railway
  }
});

// ESTA É A FUNÇÃO QUE ESTÁ FALTANDO NO SEU BUILD:
export async function query({ query, values }: { query: string; values?: any[] }) {
  try {
    const [results] = await pool.execute(query, values);
    return results;
  } catch (error: any) {
    throw new Error(`Erro na query: ${error.message}`);
  }
}

export default pool;