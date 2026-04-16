'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Brain, Eye, AlertCircle, UserPlus } from 'lucide-react'

const TIPOS_PCD = [
  'Não PCD',
  'PCD Motor - Cadeirante',
  'PCD Motor - Mobilidade Reduzida',
  'PCD Visual - Cegueira',
  'PCD Visual - Baixa Visão',
  'PCD Auditivo - Surdez',
  'PCD Auditivo - Deficiência Parcial',
  'PCD Intelectual',
  'PCD Múltipla',
  'Outro'
]

const SETORES = [
  'Administração',
  'Produção',
  'Copa',
  'Recepção',
  'TI',
  'RH',
  'Financeiro',
  'Logística',
  'Manutenção',
  'Sala de Reuniões',
  'Outro'
]

export default function RegistroPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cargo: 'operador' as 'operador' | 'administrador',
    tipo_pcd: '',
    setor: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          cargo: formData.cargo,
          tipo_pcd: formData.tipo_pcd || null,
          setor: formData.setor || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta')
        return
      }

      router.push(data.redirectTo)
      router.refresh()
    } catch {
      setError('Erro de conexão. Verifique sua internet.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg">
        {/* Logo e Título */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-3">
            <Brain className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">GP-2026</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2 mt-1 text-sm">
            <Eye className="w-4 h-4" />
            IA & Gêmeo Digital
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Criar Conta
            </CardTitle>
            <CardDescription>
              Preencha os dados abaixo para se registrar no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@empresa.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.senha}
                    onChange={(e) => handleChange('senha', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    placeholder="Repita a senha"
                    value={formData.confirmarSenha}
                    onChange={(e) => handleChange('confirmarSenha', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cargo">Tipo de Acesso *</Label>
                  <Select 
                    value={formData.cargo} 
                    onValueChange={(v) => handleChange('cargo', v)}
                    disabled={loading}
                  >
                    <SelectTrigger id="cargo">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operador">Operador (Relatar Problemas)</SelectItem>
                      <SelectItem value="administrador">Administrador (Gerenciar OS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="setor">Setor</Label>
                  <Select 
                    value={formData.setor} 
                    onValueChange={(v) => handleChange('setor', v)}
                    disabled={loading}
                  >
                    <SelectTrigger id="setor">
                      <SelectValue placeholder="Selecione seu setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {SETORES.map(setor => (
                        <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_pcd">Tipo de PCD (opcional)</Label>
                <Select 
                  value={formData.tipo_pcd} 
                  onValueChange={(v) => handleChange('tipo_pcd', v)}
                  disabled={loading}
                >
                  <SelectTrigger id="tipo_pcd">
                    <SelectValue placeholder="Selecione se aplicável" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_PCD.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Informação utilizada para melhorar as análises de acessibilidade
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Criar Conta
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link 
                href="/login" 
                className="text-primary font-medium hover:underline"
              >
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
