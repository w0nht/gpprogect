'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Box, AlertTriangle, ZoomIn, ZoomOut, RotateCw, Layers } from 'lucide-react'

interface ConflitoPonto {
  id: string
  setor: string
  descricao: string
  altura?: string
  tipo: 'barreira_fisica' | 'sinalizacao' | 'mobiliario' | 'acesso'
  severidade: 'alta' | 'media' | 'baixa'
}

interface GemeoDigitalProps {
  conflitos?: ConflitoPonto[]
  setorAtivo?: string
}

const SETORES_PLANTA = [
  { id: 'recepcao', nome: 'Recepção', x: 10, y: 10, w: 25, h: 20 },
  { id: 'copa', nome: 'Copa', x: 40, y: 10, w: 20, h: 20 },
  { id: 'reunioes', nome: 'Sala de Reuniões', x: 65, y: 10, w: 25, h: 20 },
  { id: 'banheiros', nome: 'Banheiros', x: 10, y: 35, w: 15, h: 25 },
  { id: 'administrativo', nome: 'Administrativo', x: 30, y: 35, w: 35, h: 25 },
  { id: 'rh', nome: 'RH', x: 70, y: 35, w: 20, h: 25 },
  { id: 'ti', nome: 'TI', x: 10, y: 65, w: 25, h: 25 },
  { id: 'almoxarifado', nome: 'Almoxarifado', x: 40, y: 65, w: 25, h: 25 },
  { id: 'estacionamento', nome: 'Estacionamento', x: 70, y: 65, w: 20, h: 25 },
]

const CONFLITOS_EXEMPLO: ConflitoPonto[] = [
  {
    id: '1',
    setor: 'copa',
    descricao: 'Prateleira a 1,60m de altura',
    altura: '1,60m',
    tipo: 'mobiliario',
    severidade: 'alta'
  },
  {
    id: '2',
    setor: 'recepcao',
    descricao: 'Sinalização com baixo contraste',
    tipo: 'sinalizacao',
    severidade: 'media'
  },
  {
    id: '3',
    setor: 'reunioes',
    descricao: 'Ausência de alarme visual',
    tipo: 'sinalizacao',
    severidade: 'alta'
  }
]

export function GemeoDigital({ conflitos = CONFLITOS_EXEMPLO, setorAtivo }: GemeoDigitalProps) {
  const [zoom, setZoom] = useState(100)
  const [selectedConflito, setSelectedConflito] = useState<ConflitoPonto | null>(null)
  const [showLayers, setShowLayers] = useState(true)

  const getSetorConflitos = (setorId: string) => {
    return conflitos.filter(c => c.setor.toLowerCase().includes(setorId))
  }

  const getSeveridadeColor = (severidade: string) => {
    switch (severidade) {
      case 'alta': return 'fill-destructive stroke-destructive'
      case 'media': return 'fill-warning stroke-warning'
      case 'baixa': return 'fill-info stroke-info'
      default: return 'fill-muted stroke-muted'
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Box className="h-5 w-5 text-accent" />
              Os Olhos - Gêmeo Digital
            </CardTitle>
            <CardDescription>
              Visualização da planta baixa com pontos de conflito
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs font-mono w-12 text-center">{zoom}%</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(100)}
              className="h-8 w-8"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant={showLayers ? 'default' : 'outline'}
              size="icon"
              onClick={() => setShowLayers(!showLayers)}
              className="h-8 w-8"
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-secondary/30 rounded-lg border border-border overflow-hidden">
          {/* Planta Baixa SVG */}
          <div 
            className="w-full aspect-[16/10] p-4"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid de fundo */}
              <defs>
                <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M 5 0 L 0 0 0 5" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-border" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />

              {/* Setores */}
              {SETORES_PLANTA.map((setor) => {
                const setorConflitos = getSetorConflitos(setor.id)
                const hasConflito = setorConflitos.length > 0
                const isAtivo = setorAtivo?.toLowerCase().includes(setor.id)

                return (
                  <g key={setor.id}>
                    <rect
                      x={setor.x}
                      y={setor.y}
                      width={setor.w}
                      height={setor.h}
                      rx="1"
                      className={`
                        ${isAtivo ? 'fill-accent/20 stroke-accent stroke-2' : 'fill-card stroke-border'}
                        ${hasConflito ? 'stroke-destructive/50' : ''}
                        transition-all cursor-pointer hover:fill-accent/10
                      `}
                      strokeWidth={isAtivo ? 0.8 : 0.3}
                    />
                    <text
                      x={setor.x + setor.w / 2}
                      y={setor.y + setor.h / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[2.5px] fill-foreground font-medium"
                    >
                      {setor.nome}
                    </text>

                    {/* Marcadores de conflito */}
                    {showLayers && setorConflitos.map((conflito, idx) => (
                      <g
                        key={conflito.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedConflito(conflito)}
                      >
                        <circle
                          cx={setor.x + setor.w / 2 + (idx * 3)}
                          cy={setor.y + setor.h - 4}
                          r="2"
                          className={`${getSeveridadeColor(conflito.severidade)} animate-pulse`}
                          fillOpacity="0.3"
                          strokeWidth="0.3"
                        />
                        <circle
                          cx={setor.x + setor.w / 2 + (idx * 3)}
                          cy={setor.y + setor.h - 4}
                          r="1"
                          className={getSeveridadeColor(conflito.severidade)}
                          strokeWidth="0.2"
                        />
                      </g>
                    ))}
                  </g>
                )
              })}

              {/* Legenda */}
              <g transform="translate(2, 92)">
                <rect x="0" y="0" width="3" height="3" rx="0.5" className="fill-destructive" />
                <text x="4" y="2.5" className="text-[2px] fill-foreground">Alta</text>
                <rect x="15" y="0" width="3" height="3" rx="0.5" className="fill-warning" />
                <text x="19" y="2.5" className="text-[2px] fill-foreground">Média</text>
                <rect x="30" y="0" width="3" height="3" rx="0.5" className="fill-info" />
                <text x="34" y="2.5" className="text-[2px] fill-foreground">Baixa</text>
              </g>
            </svg>
          </div>

          {/* Info Panel */}
          {selectedConflito && (
            <div className="absolute bottom-4 left-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`h-5 w-5 ${
                    selectedConflito.severidade === 'alta' ? 'text-destructive' :
                    selectedConflito.severidade === 'media' ? 'text-warning' : 'text-info'
                  }`} />
                  <div>
                    <p className="font-medium text-foreground">
                      Detectada barreira física no Setor {selectedConflito.setor.charAt(0).toUpperCase() + selectedConflito.setor.slice(1)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedConflito.descricao}
                      {selectedConflito.altura && ` - Altura: ${selectedConflito.altura}`}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {selectedConflito.tipo.replace('_', ' ')}
                      </Badge>
                      <Badge className={`text-xs ${
                        selectedConflito.severidade === 'alta' ? 'bg-destructive text-destructive-foreground' :
                        selectedConflito.severidade === 'media' ? 'bg-warning text-warning-foreground' : 
                        'bg-info text-info-foreground'
                      }`}>
                        Severidade {selectedConflito.severidade}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedConflito(null)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Conflitos */}
        {conflitos.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Pontos de Conflito Identificados ({conflitos.length})
            </h4>
            <div className="space-y-2">
              {conflitos.map((conflito) => (
                <div
                  key={conflito.id}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => setSelectedConflito(conflito)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${
                      conflito.severidade === 'alta' ? 'bg-destructive' :
                      conflito.severidade === 'media' ? 'bg-warning' : 'bg-info'
                    }`} />
                    <span className="text-sm text-foreground capitalize">
                      {conflito.setor}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {conflito.descricao}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
