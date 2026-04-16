'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  FileText, 
  User, 
  MapPin, 
  Clock, 
  Wrench, 
  ChevronDown, 
  ChevronUp,
  Lightbulb,
  BookOpen,
  AlertTriangle
} from 'lucide-react'
import type { OrdemServico, OSStatus } from '@/lib/types'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/types'

interface OrdemServicoCardProps {
  ordem: OrdemServico
  isAdmin?: boolean
  onStatusChange?: (id: number, newStatus: OSStatus) => Promise<void>
}

export function OrdemServicoCard({ ordem, isAdmin = false, onStatusChange }: OrdemServicoCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(ordem.status)

  const handleStatusChange = async (newStatus: OSStatus) => {
    if (!onStatusChange) return
    
    setIsUpdating(true)
    try {
      await onStatusChange(ordem.id, newStatus)
      setCurrentStatus(newStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  // --- CORREÇÃO AQUI: Lógica para tratar JSON ou Texto Puro ---
  const getSugestoes = () => {
    if (!ordem.sugestao_ia) return []
    try {
      // Se for uma string que parece JSON (começa com [ ou {), tenta o parse
      if (typeof ordem.sugestao_ia === 'string' && (ordem.sugestao_ia.trim().startsWith('[') || ordem.sugestao_ia.trim().startsWith('{'))) {
        const parsed = JSON.parse(ordem.sugestao_ia)
        return Array.isArray(parsed) ? parsed : [parsed]
      }
      // Se não for JSON, retorna como um item único de array
      return [ordem.sugestao_ia]
    } catch (e) {
      // Caso o parse falhe por qualquer motivo, retorna o texto original num array
      return [ordem.sugestao_ia]
    }
  }

  const sugestoes = getSugestoes()

  return (
    <Card className="border-border hover:border-accent/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                {ordem.protocolo}
              </CardTitle>
              <CardDescription className="text-xs">
                Criado em {new Date(ordem.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </CardDescription>
            </div>
          </div>
          
          {isAdmin && onStatusChange ? (
            <div className="flex items-center gap-2">
              {isUpdating && <Spinner className="h-4 w-4" />}
              <Select
                value={currentStatus}
                onValueChange={(value) => handleStatusChange(value as OSStatus)}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_LABELS) as OSStatus[]).map((status) => (
                    <SelectItem key={status} value={status} className="text-xs">
                      {STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Badge className={`${STATUS_COLORS[currentStatus]} text-xs`}>
              {STATUS_LABELS[currentStatus]}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Info básico */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{ordem.colaborador_nome}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{ordem.setor}</span>
          </div>
          {ordem.colaborador_tipo_pcd && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="text-xs">
                {ordem.colaborador_tipo_pcd}
              </Badge>
            </div>
          )}
        </div>

        {/* Descrição do problema */}
        <div className="p-3 bg-secondary/30 rounded-lg">
          <p className="text-sm text-foreground">{ordem.descricao_problema}</p>
        </div>

        {/* Toggle para detalhes */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Ocultar Detalhes da Análise
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Ver Detalhes da Análise IA
            </>
          )}
        </Button>

        {/* Detalhes expandidos */}
        {expanded && (
          <div className="space-y-4 pt-2 border-t border-border">
            {/* Análise da IA */}
            {ordem.analise_ia && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">Análise da IA</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {ordem.analise_ia}
                </p>
              </div>
            )}

            {/* Norma de Referência */}
            {ordem.norma_referencia && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">Norma de Referência</span>
                </div>
                <Badge variant="outline" className="ml-6">
                  {ordem.norma_referencia}
                </Badge>
              </div>
            )}

            {/* Barreira Detectada */}
            {ordem.barreira_detectada && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-foreground">Barreira Detectada</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {ordem.barreira_detectada}
                </p>
              </div>
            )}

            {/* Localização do Conflito */}
            {ordem.localizacao_conflito && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">Localização do Conflito</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {ordem.localizacao_conflito}
                </p>
              </div>
            )}

            {/* Sugestões da IA */}
            {sugestoes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">Sugestões da IA</span>
                </div>
                <ul className="space-y-1 pl-6">
                  {sugestoes.map((sugestao: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Wrench className="h-3 w-3 mt-1 text-accent flex-shrink-0" />
                      {sugestao}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Última atualização */}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Última atualização: {new Date(ordem.updated_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}