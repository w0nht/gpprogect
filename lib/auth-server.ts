import { query } from './db'
import { Usuario, Sessao } from './types'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'

const SESSION_DURATION_HOURS = 24

// ──────────────────────────────────────────────
// Mock in-memory store (quando DB não está disponível)
// ──────────────────────────────────────────────
const MOCK_USERS: (Usuario & { senha_hash: string })[] = [
  {
    id: 1,
    nome: 'Administrador',
    email: 'admin@gp2026.com',
    senha_hash: 'MOCK',
    cargo: 'administrador',
    tipo_pcd: null,
    setor: 'TI',
    ativo: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    nome: 'Wanderson Silva',
    email: 'wanderson@gp2026.com',
    senha_hash: 'MOCK',
    cargo: 'operador',
    tipo_pcd: 'PCD Motor - Cadeirante',
    setor: 'Producao',
    ativo: true,
    created_at: new Date().toISOString(),
  },
]

const MOCK_SESSIONS: Record<string, { usuarioId: number; expiresAt: Date }> = {}

// Mapa de senhas mock (email -> senha em texto puro)
const MOCK_PASSWORDS: Record<string, string> = {
  'admin@gp2026.com': 'admin123',
  'wanderson@gp2026.com': 'operador123',
}

let DB_AVAILABLE: boolean | null = null

async function isDbAvailable(): Promise<boolean> {
  if (DB_AVAILABLE !== null) return DB_AVAILABLE
  try {
    await query('SELECT 1')
    DB_AVAILABLE = true
  } catch {
    DB_AVAILABLE = false
  }
  return DB_AVAILABLE
}

// ──────────────────────────────────────────────
// Password
// ──────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hash: string,
  email?: string
): Promise<boolean> {
  if (!await isDbAvailable()) {
    return email ? MOCK_PASSWORDS[email] === password : false
  }
  return bcrypt.compare(password, hash)
}

// ──────────────────────────────────────────────
// Session
// ──────────────────────────────────────────────
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

export async function createSession(userId: number): Promise<string> {
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000)

  if (!await isDbAvailable()) {
    MOCK_SESSIONS[token] = { usuarioId: userId, expiresAt }
    return token
  }

  await query(
    'INSERT INTO sessoes (usuario_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  )
  return token
}

export async function getSessionByToken(token: string): Promise<Sessao | null> {
  if (!await isDbAvailable()) {
    const s = MOCK_SESSIONS[token]
    if (!s || s.expiresAt < new Date()) return null
    return { id: 0, usuario_id: s.usuarioId, token, expires_at: s.expiresAt.toISOString() }
  }

  const sessions = await query<Sessao[]>(
    'SELECT * FROM sessoes WHERE token = ? AND expires_at > NOW()',
    [token]
  )
  return (sessions as Sessao[])[0] || null
}

// ──────────────────────────────────────────────
// Usuários
// ──────────────────────────────────────────────
export async function getUserById(id: number): Promise<Usuario | null> {
  if (!await isDbAvailable()) {
    const u = MOCK_USERS.find(u => u.id === id)
    if (!u) return null
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha_hash, ...safe } = u
    return safe
  }

  const users = await query<Usuario[]>(
    'SELECT id, nome, email, cargo, tipo_pcd, setor, ativo, created_at FROM usuarios WHERE id = ? AND ativo = TRUE',
    [id]
  )
  return (users as Usuario[])[0] || null
}

export async function getUserByEmail(
  email: string
): Promise<(Usuario & { senha_hash: string }) | null> {
  if (!await isDbAvailable()) {
    return MOCK_USERS.find(u => u.email === email && u.ativo) || null
  }

  const users = await query<(Usuario & { senha_hash: string })[]>(
    'SELECT * FROM usuarios WHERE email = ? AND ativo = TRUE',
    [email]
  )
  return (users as (Usuario & { senha_hash: string })[])[0] || null
}

export async function getCurrentUser(): Promise<Usuario | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value

    if (!sessionToken) return null

    const session = await getSessionByToken(sessionToken)
    if (!session) return null

    return getUserById(session.usuario_id)
  } catch {
    return null
  }
}

export async function deleteSession(token: string): Promise<void> {
  if (!await isDbAvailable()) {
    delete MOCK_SESSIONS[token]
    return
  }
  await query('DELETE FROM sessoes WHERE token = ?', [token])
}

export async function registerUser(data: {
  nome: string
  email: string
  senha: string
  cargo: 'operador' | 'administrador'
  tipo_pcd?: string
  setor?: string
}): Promise<Usuario> {
  if (!await isDbAvailable()) {
    const newId = MOCK_USERS.length + 1
    const newUser = {
      id: newId,
      nome: data.nome,
      email: data.email,
      senha_hash: 'MOCK',
      cargo: data.cargo,
      tipo_pcd: data.tipo_pcd || null,
      setor: data.setor || null,
      ativo: true,
      created_at: new Date().toISOString(),
    }
    MOCK_USERS.push(newUser)
    MOCK_PASSWORDS[data.email] = data.senha
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha_hash, ...safe } = newUser
    return safe
  }

  const senhaHash = await hashPassword(data.senha)
  const result = await query<{ insertId: number }>(
    `INSERT INTO usuarios (nome, email, senha_hash, cargo, tipo_pcd, setor) VALUES (?, ?, ?, ?, ?, ?)`,
    [data.nome, data.email, senhaHash, data.cargo, data.tipo_pcd || null, data.setor || null]
  )

  const user = await getUserById((result as unknown as { insertId: number }).insertId)
  if (!user) throw new Error('Falha ao criar usuario')
  return user
}
