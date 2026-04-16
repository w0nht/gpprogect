'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight,
  FileText,
  Brain,
  Wrench,
  ClipboardCheck
} from 'lucide-react'

interface FluxoResolucaoProps {
  protocolo?: string
  status?: string
  sugestaoIA?: string
}

const steps = [
  { 
    id: 1, 
    label: 'Relato Registrado', 
    icon: FileText,
    status: 'pendente'
  },
  { 
    id: 2, 
    label: 'Análise IA', 
    icon: Brain,
    status: 'em_analise'
  },
  { 
    id: 3, 
    label: 'Encaminhado Manutenção', 
    icon: Wrench,
    status: 'encaminhado_manutencao'
  },
  { 
    id: 4, 
    label: 'Concluído', 
    icon: ClipboardCheck,
    status: 'concluido'
  },
]

export function FluxoResolucao({ protocolo, status = 'pendente', sugestaoIA }: FluxoResolucaoProps) {
  const getStepIndex = () => {
    switch (status) {
      case 'pendente': return 0
      case 'em_analise': return 1
      case 'encaminhado_manutencao':
      case 'em_execucao': return 2
      case 'concluido': return 3
      case 'cancelado': return -1
      default: return 0
    }
  }

  const currentStepIndex = getStepIndex()
  const sugestoes = sugestaoIA ? JSON.parse(sugestaoIA) : []

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ClipboardCheck className="h-5 w-5 text-accent" />
              Fluxo de Resolução (RH & Operações)
            </CardTitle>
            <CardDescription>
              Acompanhe o progresso da ordem de serviço
            </CardDescription>
          </div>
          {protocolo && (
            <Badge variant="outline" className="font-mono">
              {protocolo}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stepper */}
        <div className="relative">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isComplete = index < currentStepIndex
              const isCurrent = index === currentStepIndex
              const isPending = index > currentStepIndex

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div
                    className={`
                      flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all
                      ${isComplete ? 'bg-success border-success text-success-foreground' : ''}
                      ${isCurrent ? 'bg-accent border-accent text-accent-foreground animate-pulse' : ''}
                      ${isPending ? 'bg-muted border-border text-muted-foreground' : ''}
                    `}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isCurrent ? (
                      <Icon className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`
                    mt-2 text-xs text-center max-w-[80px]
                    ${isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'}
                  `}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Connector lines */}
          <div className="absolute top-5 left-[10%] right-[10%] h-0.5 -z-0">
            <div className="h-full flex">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`flex-1 ${
                    index < currentStepIndex ? 'bg-success' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
              <Wrench className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Status: {status === 'encaminhado_manutencao' ? 'Encaminhado para Manutenção' : 
                        status === 'em_execucao' ? 'Em Execução' :
                        status === 'concluido' ? 'Concluído' :
                        status === 'em_analise' ? 'Em Análise' : 'Pendente'}
              </p>
              <p className="text-sm text-muted-foreground">
                {status === 'pendente' && 'Aguardando processamento pela IA'}
                {status === 'em_analise' && 'IA analisando o problema reportado'}
                {status === 'encaminhado_manutencao' && 'Equipe de manutenção notificada'}
                {status === 'em_execucao' && 'Execução da adequação em andamento'}
                {status === 'concluido' && 'Barreira eliminada com sucesso'}
              </p>
            </div>
          </div>
        </div>

        {/* Sugestão da IA */}
        {sugestoes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Sugestão da IA</span>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-2">
              {sugestoes.map((sugestao: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground">{sugestao}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!sugestaoIA && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">
                Instalação de prateleira retrátil ou rebaixamento do mobiliário para 1,10m.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
