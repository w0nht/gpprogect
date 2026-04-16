'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Wrench,
  TrendingUp
} from 'lucide-react'
import type { OrdemServico } from '@/lib/types'

interface StatsCardsProps {
  ordens: OrdemServico[]
}

export function StatsCards({ ordens }: StatsCardsProps) {
  const stats = {
    total: ordens.length,
    pendentes: ordens.filter(o => o.status === 'pendente').length,
    emAnalise: ordens.filter(o => o.status === 'em_analise').length,
    encaminhadas: ordens.filter(o => o.status === 'encaminhado_manutencao').length,
    emExecucao: ordens.filter(o => o.status === 'em_execucao').length,
    concluidas: ordens.filter(o => o.status === 'concluido').length,
  }

  const taxaConclusao = stats.total > 0 
    ? Math.round((stats.concluidas / stats.total) * 100) 
    : 0

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de OS
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Ordens de serviço registradas
          </p>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pendentes
          </CardTitle>
          <Clock className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{stats.pendentes}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Aguardando análise
          </p>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Em Execução
          </CardTitle>
          <Wrench className="h-4 w-4 text-info" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-info">
            {stats.encaminhadas + stats.emExecucao}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manutenção em andamento
          </p>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Concluídas
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{stats.concluidas}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-success" />
            <span className="text-xs text-muted-foreground">
              {taxaConclusao}% taxa de conclusão
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AlertCard({ ordens }: StatsCardsProps) {
  const urgentes = ordens.filter(o => 
    o.status === 'pendente' && 
    new Date(o.created_at) < new Date(Date.now() - 24 * 60 * 60 * 1000)
  )

  if (urgentes.length === 0) return null

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <CardTitle className="text-sm font-medium text-destructive">
          Atenção: {urgentes.length} OS pendente{urgentes.length > 1 ? 's' : ''} há mais de 24h
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {urgentes.slice(0, 5).map(ordem => (
            <span 
              key={ordem.id} 
              className="text-xs font-mono bg-destructive/10 text-destructive px-2 py-1 rounded"
            >
              {ordem.protocolo}
            </span>
          ))}
          {urgentes.length > 5 && (
            <span className="text-xs text-destructive">
              +{urgentes.length - 5} outras
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
