'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Send, User, MapPin, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import type { AnaliseIA } from '@/lib/types'

const TIPOS_PCD = [
  'PCD Motor - Cadeirante',
  'PCD Motor - Mobilidade Reduzida',
  'PCD Visual - Cegueira',
  'PCD Visual - Baixa Visão',
  'PCD Auditivo',
  'PCD Intelectual',
  'PCD Múltipla',
  'Não especificado'
]

const SETORES = [
  'Recepção',
  'Administrativo',
  'RH',
  'TI',
  'Copa',
  'Refeitório',
  'Banheiros',
  'Sala de Reuniões',
  'Estacionamento',
  'Área Externa',
  'Produção',
  'Almoxarifado',
  'Outro'
]

interface FormularioRelatoProps {
  onSuccess?: (protocolo: string, analise: AnaliseIA | null) => void
}

export function FormularioRelato({ onSuccess }: FormularioRelatoProps) {
  const [formData, setFormData] = useState({
    colaborador_nome: '',
    colaborador_tipo_pcd: '',
    setor: '',
    descricao_problema: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    protocolo?: string
    analise?: AnaliseIA
    error?: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    try {
      const response = await fetch('/api/ordens-servico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          success: true,
          protocolo: data.data.protocolo,
          analise: data.data.analise
        })
        onSuccess?.(data.data.protocolo, data.data.analise)
        
        // Reset form
        setFormData({
          colaborador_nome: '',
          colaborador_tipo_pcd: '',
          setor: '',
          descricao_problema: ''
        })
      } else {
        setResult({ success: false, error: data.error })
      }
    } catch {
      setResult({ success: false, error: 'Erro de conexão. Verifique se o banco de dados está acessível.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5 text-accent" />
          Relatar Barreira de Acessibilidade
        </CardTitle>
        <CardDescription>
          Descreva o problema encontrado. Nossa IA irá analisar e gerar uma ordem de serviço automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="nome" className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Nome do Colaborador
              </label>
              <Input
                id="nome"
                placeholder="Seu nome completo"
                value={formData.colaborador_nome}
                onChange={(e) => setFormData({ ...formData, colaborador_nome: e.target.value })}
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tipo-pcd" className="text-sm font-medium text-foreground">
                Tipo de Deficiência (opcional)
              </label>
              <Select
                value={formData.colaborador_tipo_pcd}
                onValueChange={(value) => setFormData({ ...formData, colaborador_tipo_pcd: value })}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_PCD.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="setor" className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Setor / Localização
            </label>
            <Select
              value={formData.setor}
              onValueChange={(value) => setFormData({ ...formData, setor: value })}
              required
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Onde está o problema?" />
              </SelectTrigger>
              <SelectContent>
                {SETORES.map((setor) => (
                  <SelectItem key={setor} value={setor}>
                    {setor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="descricao" className="text-sm font-medium text-foreground">
              Descrição do Problema
            </label>
            <Textarea
              id="descricao"
              placeholder="Exemplo: Sou cadeirante e não consigo alcançar os materiais nas prateleiras altas da Copa."
              value={formData.descricao_problema}
              onChange={(e) => setFormData({ ...formData, descricao_problema: e.target.value })}
              required
              rows={4}
              className="bg-input border-border resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Descreva detalhadamente a barreira encontrada para uma análise precisa da IA.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Processando com IA...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Relato
              </>
            )}
          </Button>
        </form>

        {/* Result Feedback */}
        {result && (
          <div className={`mt-4 p-4 rounded-lg border ${
            result.success 
              ? 'bg-success/10 border-success/30' 
              : 'bg-destructive/10 border-destructive/30'
          }`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              )}
              <div className="flex-1">
                {result.success ? (
                  <>
                    <p className="font-medium text-foreground">
                      Ordem de Serviço criada com sucesso!
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Protocolo:</span>
                      <Badge variant="outline" className="font-mono">
                        {result.protocolo}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Guarde este número para acompanhar o status da sua solicitação.
                    </p>
                  </>
                ) : (
                  <p className="text-destructive">{result.error}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
