// Este arquivo é mantido para compatibilidade.
// Toda a lógica de autenticação foi movida para lib/auth-server.ts
// para garantir que bcryptjs e mysql2 sejam executados apenas no servidor.
export * from './auth-server'
