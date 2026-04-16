'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Brain, 
  Settings, 
  Server, 
  Zap,
  BookOpen,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function ConfiguracoesIAPage() {
  const [config, setConfig] = useState({
    modelo: 'llama-3.3-70b-versatile',
    temperatura: 0.7,
    maxTokens: 1024,
    normaBase: 'NBR 9050:2020'
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('idle')

    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSaveStatus('success')
    setIsSaving(false)
    
    setTimeout(() => setSaveStatus('idle'), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole="administrador" />
      
      <div className="pl-64 transition-all duration-300">
        <Header title="Configurações de IA" userRole="administrador" />
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Título */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Configurações do Modelo de IA
              </h2>
              <p className="text-muted-foreground mt-1">
                Ajuste os parâmetros do modelo Llama para análise de acessibilidade
              </p>
            </div>

            {/* Status da Conexão */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Server className="h-4 w-4 text-accent" />
                  Status da Conexão
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                    <span className="text-sm text-foreground">Groq API</span>
                  </div>
                  <Badge className="bg-success text-success-foreground">Conectado</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                    <span className="text-sm text-foreground">Modelo Llama 3.3 70B</span>
                  </div>
                  <Badge variant="outline">Disponível</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-warning animate-pulse" />
                    <span className="text-sm text-foreground">MySQL Database</span>
                  </div>
                  <Badge className="bg-warning text-warning-foreground">Local</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Configurações do Modelo */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="h-4 w-4 text-accent" />
                  Parâmetros do Modelo
                </CardTitle>
                <CardDescription>
                  Configure os parâmetros de geração de texto do modelo Llama
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Modelo */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Modelo de IA
                  </label>
                  <Select
                    value={config.modelo}
                    onValueChange={(value) => setConfig({ ...config, modelo: value })}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llama-3.3-70b-versatile">
                        Llama 3.3 70B Versatile (Recomendado)
                      </SelectItem>
                      <SelectItem value="llama-3.1-70b-versatile">
                        Llama 3.1 70B Versatile
                      </SelectItem>
                      <SelectItem value="llama-3.1-8b-instant">
                        Llama 3.1 8B Instant (Mais rápido)
                      </SelectItem>
                      <SelectItem value="mixtral-8x7b-32768">
                        Mixtral 8x7B
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    O modelo 70B oferece análises mais detalhadas e precisas.
                  </p>
                </div>

                {/* Temperatura */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Temperatura
                    </label>
                    <Badge variant="outline" className="font-mono">
                      {config.temperatura.toFixed(2)}
                    </Badge>
                  </div>
                  <Slider
                    value={[config.temperatura]}
                    onValueChange={([value]) => setConfig({ ...config, temperatura: value })}
                    min={0}
                    max={1}
                    step={0.05}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mais preciso (0.0)</span>
                    <span>Mais criativo (1.0)</span>
                  </div>
                </div>

                {/* Max Tokens */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Máximo de Tokens
                  </label>
                  <Input
                    type="number"
                    value={config.maxTokens}
                    onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) || 1024 })}
                    min={256}
                    max={4096}
                    className="bg-input border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Controla o tamanho máximo da resposta da IA (256 - 4096).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Configurações de Normas */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4 text-accent" />
                  Base de Conhecimento
                </CardTitle>
                <CardDescription>
                  Normas e regulamentos utilizados na análise de acessibilidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Norma Base
                  </label>
                  <Select
                    value={config.normaBase}
                    onValueChange={(value) => setConfig({ ...config, normaBase: value })}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NBR 9050:2020">
                        NBR 9050:2020 - Acessibilidade a edificações
                      </SelectItem>
                      <SelectItem value="NBR 16537:2016">
                        NBR 16537:2016 - Sinalização tátil no piso
                      </SelectItem>
                      <SelectItem value="Lei 13146/2015">
                        Lei 13.146/2015 - Estatuto da Pessoa com Deficiência
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Parâmetros Técnicos Ativos
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <li>• Alcance manual cadeirantes: 0,40m - 1,20m</li>
                        <li>• Largura mínima corredores: 1,20m</li>
                        <li>• Vão livre portas: mínimo 0,80m</li>
                        <li>• Inclinação máxima rampas: 8,33%</li>
                        <li>• Contraste mínimo sinalização: 70%</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Log de Integração */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-4 w-4 text-accent" />
                  Log de Integração (Hard-Code)
                </CardTitle>
                <CardDescription>
                  Configuração JSON atual da integração com o modelo Llama
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-sidebar text-sidebar-foreground rounded-lg text-xs overflow-x-auto font-mono">
{JSON.stringify({
  api: {
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    method: "POST",
    headers: {
      "Authorization": "Bearer ${GROQ_API_KEY}",
      "Content-Type": "application/json"
    }
  },
  model: {
    name: config.modelo,
    temperature: config.temperatura,
    max_tokens: config.maxTokens,
    response_format: { type: "json_object" }
  },
  knowledge_base: {
    norma_principal: config.normaBase,
    parametros_ativos: [
      "alcance_manual",
      "largura_corredores",
      "vao_portas",
      "inclinacao_rampas",
      "contraste_sinalizacao"
    ]
  },
  database: {
    type: "mysql",
    host: "localhost",
    database: "gp2026_acessibilidade"
  }
}, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {/* Ações */}
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={() => setConfig({
                modelo: 'llama-3.3-70b-versatile',
                temperatura: 0.7,
                maxTokens: 1024,
                normaBase: 'NBR 9050:2020'
              })}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Restaurar Padrões
              </Button>

              <div className="flex items-center gap-3">
                {saveStatus === 'success' && (
                  <span className="flex items-center gap-1 text-sm text-success">
                    <CheckCircle className="h-4 w-4" />
                    Salvo com sucesso
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Erro ao salvar
                  </span>
                )}
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Configurações
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
