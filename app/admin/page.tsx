'use client'

import { useEffect, useState, useCallback } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { StatsCards, AlertCard } from '@/components/dashboard/stats-cards'
import { OrdemServicoCard } from '@/components/dashboard/ordem-servico-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RefreshCw, Filter, AlertCircle } from 'lucide-react'
import type { OrdemServico, OSStatus } from '@/lib/types'
import { STATUS_LABELS } from '@/lib/types'

export default function AdminDashboard() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<OSStatus | 'all'>('all')

  const fetchOrdens = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const url = activeFilter === 'all' 
        ? '/api/ordens-servico' 
        : `/api/ordens-servico?status=${activeFilter}`
      
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setOrdens(data.data)
      } else {
        setError(data.error || 'Erro ao carregar ordens de serviço')
      }
    } catch {
      setError('Erro de conexão. Verifique se o banco de dados está acessível.')
    } finally {
      setIsLoading(false)
    }
  }, [activeFilter])

  useEffect(() => {
    fetchOrdens()
  }, [fetchOrdens])

  const handleStatusChange = async (id: number, newStatus: OSStatus) => {
    try {
      const response = await fetch(`/api/ordens-servico/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (data.success) {
        // Atualizar localmente
        setOrdens(prev => 
          prev.map(o => o.id === id ? { ...o, status: newStatus } : o)
        )
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      throw err
    }
  }

  const filteredOrdens = ordens

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole="administrador" />
      
      <div className="pl-64 transition-all duration-300">
        <Header title="Dashboard" userRole="administrador" />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Título e Ações */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Gestão de Ordens de Serviço
                </h2>
                <p className="text-muted-foreground mt-1">
                  Visualize e gerencie todas as solicitações de acessibilidade
                </p>
              </div>
              <Button 
                onClick={fetchOrdens} 
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Atualizar
              </Button>
            </div>

            {/* Erro */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchOrdens}>
                  Tentar novamente
                </Button>
              </div>
            )}

            {/* Stats Cards */}
            {!isLoading && !error && (
              <>
                <StatsCards ordens={ordens} />
                <AlertCard ordens={ordens} />
              </>
            )}

            {/* Tabs de Filtro */}
            <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as OSStatus | 'all')}>
              <div className="flex items-center justify-between">
                <TabsList className="bg-muted">
                  <TabsTrigger value="all">
                    Todas
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {ordens.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pendente">Pendentes</TabsTrigger>
                  <TabsTrigger value="em_analise">Em Análise</TabsTrigger>
                  <TabsTrigger value="encaminhado_manutencao">Manutenção</TabsTrigger>
                  <TabsTrigger value="concluido">Concluídas</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Filtro ativo: {activeFilter === 'all' ? 'Todas' : STATUS_LABELS[activeFilter as OSStatus]}</span>
                </div>
              </div>

              <TabsContent value={activeFilter} className="mt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Spinner className="h-8 w-8 text-accent" />
                  </div>
                ) : filteredOrdens.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Filter className="h-12 w-12 mb-4 opacity-30" />
                    <p className="text-lg font-medium">Nenhuma ordem de serviço encontrada</p>
                    <p className="text-sm mt-1">
                      {activeFilter !== 'all' 
                        ? 'Tente selecionar outro filtro'
                        : 'Aguardando novos relatos dos colaboradores'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrdens.map((ordem) => (
                      <OrdemServicoCard
                        key={ordem.id}
                        ordem={ordem}
                        isAdmin={true}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
