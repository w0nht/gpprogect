'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { GemeoDigital } from '@/components/dashboard/gemeo-digital'
import { OrdemServicoCard } from '@/components/dashboard/ordem-servico-card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import type { OrdemServico, OSStatus } from '@/lib/types'

interface ConflitoPonto {
  id: string
  setor: string
  descricao: string
  altura?: string
  tipo: 'barreira_fisica' | 'sinalizacao' | 'mobiliario' | 'acesso'
  severidade: 'alta' | 'media' | 'baixa'
}

export default function GemeoDigitalPage() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrdens = async () => {
      try {
        const response = await fetch('/api/ordens-servico')
        const data = await response.json()
        if (data.success) {
          setOrdens(data.data.filter((o: OrdemServico) => 
            o.status !== 'concluido' && o.status !== 'cancelado'
          ))
        }
      } catch (error) {
        console.error('Erro ao carregar ordens:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrdens()
  }, [])

  // Converter ordens em pontos de conflito para o gêmeo digital
  const conflitos: ConflitoPonto[] = ordens.map((ordem, idx) => ({
    id: ordem.id.toString(),
    setor: ordem.setor.toLowerCase(),
    descricao: ordem.barreira_detectada || ordem.descricao_problema.substring(0, 50) + '...',
    altura: ordem.localizacao_conflito?.match(/\d+,?\d*m/)?.[0],
    tipo: ordem.colaborador_tipo_pcd?.includes('Motor') ? 'mobiliario' :
          ordem.colaborador_tipo_pcd?.includes('Visual') ? 'sinalizacao' : 'barreira_fisica',
    severidade: ordem.status === 'pendente' ? 'alta' : 
                ordem.status === 'em_analise' ? 'media' : 'baixa'
  }))

  const handleStatusChange = async (id: number, newStatus: OSStatus) => {
    try {
      const response = await fetch(`/api/ordens-servico/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setOrdens(prev => 
          prev.map(o => o.id === id ? { ...o, status: newStatus } : o)
        )
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole="administrador" />
      
      <div className="pl-64 transition-all duration-300">
        <Header title="Mapa 3D (Gêmeo)" userRole="administrador" />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Título */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Visualização do Gêmeo Digital
              </h2>
              <p className="text-muted-foreground mt-1">
                Mapeamento espacial das barreiras de acessibilidade identificadas
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner className="h-8 w-8 text-accent" />
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Gêmeo Digital */}
                <div className="lg:col-span-2">
                  <GemeoDigital 
                    conflitos={conflitos}
                    setorAtivo={selectedSetor || undefined}
                  />
                </div>

                {/* Lista de OS Ativas */}
                <div className="space-y-4">
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        Barreiras Ativas
                      </CardTitle>
                      <CardDescription>
                        {ordens.length} pontos de conflito no mapa
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                      {ordens.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Nenhuma barreira ativa no momento
                        </p>
                      ) : (
                        ordens.map((ordem) => (
                          <div
                            key={ordem.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedSetor === ordem.setor.toLowerCase()
                                ? 'border-accent bg-accent/10'
                                : 'border-border hover:border-accent/50'
                            }`}
                            onClick={() => setSelectedSetor(
                              selectedSetor === ordem.setor.toLowerCase() 
                                ? null 
                                : ordem.setor.toLowerCase()
                            )}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-foreground">
                                {ordem.setor}
                              </span>
                              <Badge variant="outline" className="text-xs font-mono">
                                {ordem.protocolo}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {ordem.descricao_problema}
                            </p>
                            {ordem.colaborador_tipo_pcd && (
                              <Badge variant="secondary" className="mt-2 text-xs">
                                {ordem.colaborador_tipo_pcd}
                              </Badge>
                            )}
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Detalhes das OS */}
            {ordens.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Detalhes das Ordens de Serviço
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {ordens.slice(0, 4).map((ordem) => (
                    <OrdemServicoCard
                      key={ordem.id}
                      ordem={ordem}
                      isAdmin={true}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
