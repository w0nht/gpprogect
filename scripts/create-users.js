/**
 * Script para criar usuários padrão no sistema GP-2026
 * Execute após criar as tabelas: node scripts/create-users.js
 */

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'gp2026_acessibilidade',
};

async function createUsers() {
  console.log('🔐 Criando usuários padrão...\n');
  
  const connection = await mysql.createConnection(dbConfig);

  try {
    // Usuários a serem criados
    const users = [
      {
        nome: 'Administrador',
        email: 'admin@gp2026.com',
        senha: 'admin123',
        cargo: 'administrador',
        tipo_pcd: null,
        setor: 'TI'
      },
      {
        nome: 'Wanderson Silva',
        email: 'wanderson@gp2026.com',
        senha: 'operador123',
        cargo: 'operador',
        tipo_pcd: 'PCD Motor - Cadeirante',
        setor: 'Produção'
      }
    ];

    for (const user of users) {
      // Verificar se usuário já existe
      const [existing] = await connection.execute(
        'SELECT id FROM usuarios WHERE email = ?',
        [user.email]
      );

      if (existing.length > 0) {
        console.log(`⚠️  Usuário ${user.email} já existe, pulando...`);
        continue;
      }

      // Gerar hash da senha
      const senhaHash = await bcrypt.hash(user.senha, 10);

      // Inserir usuário
      await connection.execute(
        `INSERT INTO usuarios (nome, email, senha_hash, cargo, tipo_pcd, setor) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user.nome, user.email, senhaHash, user.cargo, user.tipo_pcd, user.setor]
      );

      console.log(`✅ Usuário criado: ${user.email} (${user.cargo})`);
      console.log(`   Senha: ${user.senha}`);
    }

    console.log('\n🎉 Usuários criados com sucesso!');
    console.log('\n📋 Credenciais de acesso:');
    console.log('   Administrador: admin@gp2026.com / admin123');
    console.log('   Operador: wanderson@gp2026.com / operador123');

  } catch (error) {
    console.error('❌ Erro ao criar usuários:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

createUsers().catch(console.error);
