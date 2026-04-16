'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Search, FileText, AlertCircle } from 'lucide-react'
import { OrdemServicoCard } from './ordem-servico-card'
import type { OrdemServico } from '@/lib/types'

export function ConsultaOS() {
  const [protocolo, setProtocolo] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [ordem, setOrdem] = useState<OrdemServico | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!protocolo.trim()) return

    setIsSearching(true)
    setError(null)
    setOrdem(null)

    try {
      const response = await fetch(`/api/ordens-servico/protocolo/${encodeURIComponent(protocolo)}`)
      const data = await response.json()

      if (data.success) {
        setOrdem(data.data)
      } else {
        setError(data.error || 'Ordem de serviço não encontrada')
      }
    } catch {
      setError('Erro ao buscar ordem de serviço. Verifique a conexão.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Search className="h-5 w-5 text-accent" />
            Consultar Ordem de Serviço
          </CardTitle>
          <CardDescription>
            Digite o número do protocolo para acompanhar o status da sua solicitação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ex: OS-2026-001"
                value={protocolo}
                onChange={(e) => setProtocolo(e.target.value)}
                className="pl-10 bg-input border-border font-mono"
              />
            </div>
            <Button 
              type="submit" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isSearching || !protocolo.trim()}
            >
              {isSearching ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Result */}
      {ordem && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Resultado da Busca</h3>
            <Badge variant="outline" className="font-mono">
              {ordem.protocolo}
            </Badge>
          </div>
          <OrdemServicoCard ordem={ordem} isAdmin={false} />
        </div>
      )}

      {/* Empty State */}
      {!ordem && !error && !isSearching && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <FileText className="h-16 w-16 mb-4 opacity-30" />
          <p className="text-lg font-medium">Nenhuma consulta realizada</p>
          <p className="text-sm mt-1">Digite um protocolo para buscar sua OS</p>
        </div>
      )}
    </div>
  )
}
