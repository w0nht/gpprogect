'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { FormularioRelato } from '@/components/dashboard/formulario-relato'
import { SimulacaoIA } from '@/components/dashboard/simulacao-ia'
import { FluxoResolucao } from '@/components/dashboard/fluxo-resolucao'
import type { AnaliseIA } from '@/lib/types'

export default function OperadorPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastAnalise, setLastAnalise] = useState<AnaliseIA | null>(null)
  const [lastProtocolo, setLastProtocolo] = useState<string | null>(null)
  const [tipoPcd, setTipoPcd] = useState<string>('')

  const handleSuccess = (protocolo: string, analise: AnaliseIA | null) => {
    setLastProtocolo(protocolo)
    setLastAnalise(analise)
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole="operador" />
      
      <div className="pl-64 transition-all duration-300">
        <Header title="Relatar Barreira" userRole="operador" />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Título */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Interface do Colaborador
              </h2>
              <p className="text-muted-foreground mt-1">
                Relate problemas de acessibilidade e acompanhe suas ordens de serviço
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Coluna 1: Formulário */}
              <div className="space-y-6">
                <FormularioRelato 
                  onSuccess={handleSuccess}
                />
              </div>

              {/* Coluna 2: Simulação IA + Fluxo */}
              <div className="space-y-6">
                <SimulacaoIA 
                  isProcessing={isProcessing} 
                  analise={lastAnalise}
                  tipoPcd={tipoPcd}
                />
                
                {lastProtocolo && (
                  <FluxoResolucao 
                    protocolo={lastProtocolo}
                    status="pendente"
                    sugestaoIA={lastAnalise ? JSON.stringify(lastAnalise.sugestoes) : undefined}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
