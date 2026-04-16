-- Script de criação do banco de dados GP-2026 - IA & Gêmeo Digital
-- Execute este script no seu MySQL local

CREATE DATABASE IF NOT EXISTS gp2026_acessibilidade
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE gp2026_acessibilidade;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    cargo ENUM('operador', 'administrador') NOT NULL DEFAULT 'operador',
    tipo_pcd VARCHAR(50),
    setor VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_cargo (cargo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Sessões
CREATE TABLE IF NOT EXISTS sessoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Ordens de Serviço
CREATE TABLE IF NOT EXISTS ordens_servico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    protocolo VARCHAR(20) NOT NULL UNIQUE,
    colaborador_nome VARCHAR(100) NOT NULL,
    colaborador_tipo_pcd VARCHAR(50),
    setor VARCHAR(100) NOT NULL,
    descricao_problema TEXT NOT NULL,
    analise_ia TEXT,
    norma_referencia VARCHAR(100),
    barreira_detectada TEXT,
    localizacao_conflito VARCHAR(200),
    sugestao_ia TEXT,
    status ENUM('pendente', 'em_analise', 'encaminhado_manutencao', 'em_execucao', 'concluido', 'cancelado') DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_protocolo (protocolo),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Histórico de Status
CREATE TABLE IF NOT EXISTS historico_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ordem_servico_id INT NOT NULL,
    status_anterior VARCHAR(50),
    status_novo VARCHAR(50) NOT NULL,
    observacao TEXT,
    alterado_por VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servico(id) ON DELETE CASCADE,
    INDEX idx_ordem_servico (ordem_servico_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Configurações de IA
CREATE TABLE IF NOT EXISTS configuracoes_ia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT,
    descricao VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir configurações padrão
INSERT INTO configuracoes_ia (chave, valor, descricao) VALUES
('modelo_llama', 'llama-3.3-70b-versatile', 'Modelo Llama utilizado para análise'),
('temperatura', '0.7', 'Temperatura para geração de respostas'),
('max_tokens', '1024', 'Máximo de tokens na resposta')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- NOTA: Os usuários são criados via script Node.js para gerar hashes bcrypt válidos
-- Execute: node scripts/create-users.js
-- Credenciais padrão:
--   Admin: admin@gp2026.com / admin123
--   Operador: wanderson@gp2026.com / operador123

-- Dados de exemplo para testes
INSERT INTO ordens_servico (
    protocolo, 
    colaborador_nome, 
    colaborador_tipo_pcd, 
    setor, 
    descricao_problema,
    analise_ia,
    norma_referencia,
    barreira_detectada,
    localizacao_conflito,
    sugestao_ia,
    status
) VALUES 
(
    'OS-2026-001',
    'Wanderson Silva',
    'PCD Motor - Cadeirante',
    'Copa',
    'Sou cadeirante e não consigo alcançar os materiais nas prateleiras altas da Copa.',
    'Análise baseada no perfil do colaborador (PCD Motor - Cadeirante) e cruzamento com NBR 9050:2020. O colaborador reporta dificuldade de alcance manual, característica de usuários de cadeira de rodas que possuem alcance vertical limitado.',
    'NBR 9050:2020 - Seção 4.6',
    'Prateleira instalada a 1,60m de altura, excedendo o limite máximo de alcance para cadeirantes (1,20m)',
    'Setor Copa - Prateleira superior',
    'Instalação de prateleira retrátil ou rebaixamento do mobiliário para altura entre 0,40m e 1,10m, conforme parâmetros de alcance manual para cadeirantes.',
    'encaminhado_manutencao'
),
(
    'OS-2026-002',
    'Maria Santos',
    'PCD Visual - Baixa Visão',
    'Recepção',
    'As placas de sinalização estão com letras muito pequenas e sem contraste adequado.',
    'Análise baseada no perfil do colaborador (PCD Visual - Baixa Visão) e cruzamento com NBR 9050:2020. O colaborador reporta dificuldade de leitura devido a contraste insuficiente e tamanho inadequado da tipografia.',
    'NBR 9050:2020 - Seção 5.4',
    'Sinalização com fonte menor que 40mm e contraste inferior a 70% entre texto e fundo',
    'Setor Recepção - Placas informativas',
    'Substituição das placas por versão com fonte mínima de 50mm, alto contraste (fundo escuro/texto claro) e inclusão de sinalização tátil e em Braille.',
    'em_analise'
),
(
    'OS-2026-003',
    'Carlos Oliveira',
    'PCD Auditivo',
    'Sala de Reuniões',
    'Não há sinalização visual para alarmes de emergência na sala de reuniões.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'pendente'
);
