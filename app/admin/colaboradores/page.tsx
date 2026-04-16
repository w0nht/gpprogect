'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { 
  Users, 
  User, 
  FileText,
  TrendingUp,
  Eye,
  Ear,
  Accessibility,
  Brain
} from 'lucide-react'
import type { OrdemServico } from '@/lib/types'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/types'

interface ColaboradorStats {
  nome: string
  tipoPcd: string | null
  totalOS: number
  ultimaOS: OrdemServico
}

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<ColaboradorStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/ordens-servico')
        const data = await response.json()

        if (data.success) {
          // Agrupar por colaborador
          const grouped = data.data.reduce((acc: Record<string, ColaboradorStats>, ordem: OrdemServico) => {
            const key = ordem.colaborador_nome

            if (!acc[key]) {
              acc[key] = {
                nome: ordem.colaborador_nome,
                tipoPcd: ordem.colaborador_tipo_pcd,
                totalOS: 0,
                ultimaOS: ordem
              }
            }

            acc[key].totalOS++
            if (new Date(ordem.created_at) > new Date(acc[key].ultimaOS.created_at)) {
              acc[key].ultimaOS = ordem
            }

            return acc
          }, {})

          setColaboradores(Object.values(grouped))
        }
      } catch (error) {
        console.error('Erro ao carregar colaboradores:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getIconForPcd = (tipoPcd: string | null) => {
    if (!tipoPcd) return Accessibility
    if (tipoPcd.includes('Motor')) return Accessibility
    if (tipoPcd.includes('Visual')) return Eye
    if (tipoPcd.includes('Auditivo')) return Ear
    if (tipoPcd.includes('Intelectual')) return Brain
    return User
  }

  const stats = {
    total: colaboradores.length,
    comPcd: colaboradores.filter(c => c.tipoPcd && c.tipoPcd !== 'Não especificado').length,
    totalOS: colaboradores.reduce((acc, c) => acc + c.totalOS, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole="administrador" />
      
      <div className="pl-64 transition-all duration-300">
        <Header title="Colaboradores" userRole="administrador" />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Título */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Gestão de Colaboradores
              </h2>
              <p className="text-muted-foreground mt-1">
                Visualize os colaboradores que reportaram barreiras de acessibilidade
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner className="h-8 w-8 text-accent" />
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Colaboradores
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Que reportaram barreiras
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Colaboradores PCD
                      </CardTitle>
                      <Accessibility className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-accent">{stats.comPcd}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Com deficiência declarada
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total de Relatos
                      </CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">{stats.totalOS}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-success" />
                        <span className="text-xs text-muted-foreground">
                          Média: {stats.total > 0 ? (stats.totalOS / stats.total).toFixed(1) : 0} por colaborador
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Lista de Colaboradores */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {colaboradores.map((colab) => {
                    const Icon = getIconForPcd(colab.tipoPcd)
                    
                    return (
                      <Card key={colab.nome} className="border-border hover:border-accent/50 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                              <Icon className="h-5 w-5 text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base font-semibold text-foreground truncate">
                                {colab.nome}
                              </CardTitle>
                              {colab.tipoPcd && colab.tipoPcd !== 'Não especificado' && (
                                <CardDescription className="text-xs truncate">
                                  {colab.tipoPcd}
                                </CardDescription>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total de OS:</span>
                            <Badge variant="secondary">{colab.totalOS}</Badge>
                          </div>
                          
                          <div className="pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-1">Última solicitação:</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono text-foreground">
                                {colab.ultimaOS.protocolo}
                              </span>
                              <Badge className={`text-xs ${STATUS_COLORS[colab.ultimaOS.status]}`}>
                                {STATUS_LABELS[colab.ultimaOS.status]}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {colab.ultimaOS.setor} - {new Date(colab.ultimaOS.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {colaboradores.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Users className="h-16 w-16 mb-4 opacity-30" />
                    <p className="text-lg font-medium">Nenhum colaborador encontrado</p>
                    <p className="text-sm mt-1">Aguardando relatos de barreiras</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
