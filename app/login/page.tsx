'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Brain, Eye, AlertCircle, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-context'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(email, senha)

    if (!result.success) {
      setError(result.error || 'Erro ao fazer login')
      setLoading(false)
    }
    // Se sucesso, o login() já navega — não precisa resetar loading
  }

  const preencherDemo = (tipo: 'admin' | 'operador') => {
    if (tipo === 'admin') {
      setEmail('admin@gp2026.com')
      setSenha('admin123')
    } else {
      setEmail('wanderson@gp2026.com')
      setSenha('operador123')
    }
    setError('')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">GP-2026</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2 mt-1 text-sm">
            <Eye className="w-4 h-4" />
            IA & Gemeo Digital — Gestao de Acessibilidade
          </p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Entrar no Sistema</CardTitle>
            <CardDescription>
              Acesse com suas credenciais para continuar
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

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Nao tem uma conta? </span>
              <Link href="/registro" className="text-accent font-medium hover:underline">
                Registre-se
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Atalhos de demonstração */}
        <Card className="mt-4 border-border/50 bg-muted/40">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground text-center mb-3">
              Acesso rapido (demonstracao)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={() => preencherDemo('admin')}
                disabled={loading}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Administrador
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={() => preencherDemo('operador')}
                disabled={loading}
              >
                <User className="w-3.5 h-3.5" />
                Operador
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed">
              Senha admin: <span className="font-mono font-medium">admin123</span>
              {' · '}
              Senha operador: <span className="font-mono font-medium">operador123</span>
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
