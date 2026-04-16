export type UserRole = 'operador' | 'administrador'

export interface Usuario {
  id: number
  nome: string
  email: string
  cargo: UserRole
  tipo_pcd: string | null
  setor: string | null
  ativo: boolean
  created_at: string
}

export interface Sessao {
  id: number
  usuario_id: number
  token: string
  expires_at: string
}

export interface LoginCredentials {
  email: string
  senha: string
}

export interface RegisterData {
  nome: string
  email: string
  senha: string
  cargo: UserRole
  tipo_pcd?: string
  setor?: string
}

export type OSStatus = 
  | 'pendente' 
  | 'em_analise' 
  | 'encaminhado_manutencao' 
  | 'em_execucao' 
  | 'concluido' 
  | 'cancelado'

export interface OrdemServico {
  id: number
  protocolo: string
  colaborador_nome: string
  colaborador_tipo_pcd: string | null
  setor: string
  descricao_problema: string
  analise_ia: string | null
  norma_referencia: string | null
  barreira_detectada: string | null
  localizacao_conflito: string | null
  sugestao_ia: string | null
  status: OSStatus
  created_at: string
  updated_at: string
}

export interface AnaliseIA {
  analise: string
  norma_referencia: string
  barreira_detectada: string
  localizacao_conflito: string
  sugestoes: string[]
  parametros_tecnicos: string
}

export interface FormularioRelato {
  colaborador_nome: string
  colaborador_tipo_pcd: string
  setor: string
  descricao_problema: string
}

export const STATUS_LABELS: Record<OSStatus, string> = {
  pendente: 'Pendente',
  em_analise: 'Em Análise',
  encaminhado_manutencao: 'Encaminhado para Manutenção',
  em_execucao: 'Em Execução',
  concluido: 'Concluído',
  cancelado: 'Cancelado'
}

export const STATUS_COLORS: Record<OSStatus, string> = {
  pendente: 'bg-warning text-warning-foreground',
  em_analise: 'bg-info text-info-foreground',
  encaminhado_manutencao: 'bg-chart-2 text-white',
  em_execucao: 'bg-primary text-primary-foreground',
  concluido: 'bg-success text-success-foreground',
  cancelado: 'bg-destructive text-destructive-foreground'
}
