'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Brain, CheckCircle2, Database, FileJson, Sparkles } from 'lucide-react'
import type { AnaliseIA } from '@/lib/types'

interface SimulacaoIAProps {
  isProcessing: boolean
  analise: AnaliseIA | null
  tipoPcd?: string
}

const processingSteps = [
  { id: 1, label: 'Conectando ao modelo Llama 3.3 70B...', icon: Brain },
  { id: 2, label: 'Cruzando perfil do RH com normas NBR 9050...', icon: Database },
  { id: 3, label: 'Analisando parâmetros de acessibilidade...', icon: Sparkles },
  { id: 4, label: 'Gerando análise técnica e sugestões...', icon: FileJson },
]

export function SimulacaoIA({ isProcessing, analise, tipoPcd }: SimulacaoIAProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showLog, setShowLog] = useState(false)

  useEffect(() => {
    if (isProcessing) {
      setCurrentStep(0)
      setShowLog(true)
      
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= processingSteps.length - 1) {
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 800)

      return () => clearInterval(interval)
    }
  }, [isProcessing])

  const mockJsonLog = {
    timestamp: new Date().toISOString(),
    model: "llama-3.3-70b-versatile",
    provider: "groq",
    request: {
      perfil_colaborador: tipoPcd || "PCD Motor - Cadeirante",
      norma_base: "NBR 9050:2020",
      parametros: {
        alcance_manual: { min: "0.40m", max: "1.20m" },
        largura_corredores: "1.20m",
        inclinacao_rampa: "8.33%"
      }
    },
    response: analise ? {
      status: "success",
      barreira_identificada: true,
      confianca: "94.7%"
    } : null
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Brain className="h-5 w-5 text-accent" />
          O Cérebro - Processamento IA Llama
        </CardTitle>
        <CardDescription>
          Análise inteligente utilizando modelo Llama 3.3 70B via Groq
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Processing Steps */}
        {(isProcessing || showLog) && (
          <div className="space-y-3">
            {processingSteps.map((step, index) => {
              const Icon = step.icon
              const isComplete = index < currentStep || (!isProcessing && analise)
              const isCurrent = index === currentStep && isProcessing
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                    isCurrent ? 'bg-accent/10' : isComplete ? 'bg-success/10' : 'opacity-50'
                  }`}
                >
                  {isCurrent ? (
                    <Spinner className="h-4 w-4 text-accent" />
                  ) : isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={`text-sm ${isComplete ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Technical Card */}
        {analise && !isProcessing && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-accent mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Analisando parâmetros de alcance manual para {tipoPcd || 'cadeirantes'}
                </p>
                <p className="text-xs text-muted-foreground">
                  (Alturas entre 0,40m e 1,20m conforme NBR 9050:2020)
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {analise.norma_referencia}
                  </Badge>
                  <Badge className="bg-success text-success-foreground text-xs">
                    Análise Concluída
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* JSON Log */}
        {showLog && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Log de Integração (Hard-Code)
              </span>
              <Badge variant="outline" className="text-xs font-mono">
                JSON
              </Badge>
            </div>
            <pre className="p-4 bg-sidebar text-sidebar-foreground rounded-lg text-xs overflow-x-auto font-mono">
              {JSON.stringify(mockJsonLog, null, 2)}
            </pre>
          </div>
        )}

        {!isProcessing && !analise && !showLog && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">Aguardando relato para análise...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
