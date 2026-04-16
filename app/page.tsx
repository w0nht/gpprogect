'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/auth/auth-context'
import { 
  Accessibility, 
  Users, 
  Shield, 
  ArrowRight, 
  Brain,
  Box,
  ChevronRight,
  Sun,
  Moon,
  Contrast,
  LogIn
} from 'lucide-react'

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>('light')
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('gp2026-theme') as 'light' | 'dark' | 'high-contrast' | null
    if (saved) {
      setTheme(saved)
      applyTheme(saved)
    }
  }, [])

  // Redireciona usuário logado para sua área
  useEffect(() => {
    if (!loading && user) {
      router.push(user.cargo === 'administrador' ? '/admin' : '/operador')
    }
  }, [user, loading, router])

  const applyTheme = (newTheme: 'light' | 'dark' | 'high-contrast') => {
    document.documentElement.classList.remove('dark', 'high-contrast')
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newTheme === 'high-contrast') {
      document.documentElement.classList.add('high-contrast')
    }
  }

  const cycleTheme = () => {
    const themes: ('light' | 'dark' | 'high-contrast')[] = ['light', 'dark', 'high-contrast']
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
    applyTheme(nextTheme)
    localStorage.setItem('gp2026-theme', nextTheme)
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark': return <Moon className="h-5 w-5" />
      case 'high-contrast': return <Contrast className="h-5 w-5" />
      default: return <Sun className="h-5 w-5" />
    }
  }

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
          <Brain className="h-6 w-6" />
          Carregando...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
              <Accessibility className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">GP-2026</h1>
              <p className="text-xs text-muted-foreground">IA & Gêmeo Digital</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={cycleTheme}
              title={`Tema: ${theme === 'dark' ? 'Escuro' : theme === 'high-contrast' ? 'Alto Contraste' : 'Claro'}`}
            >
              {getThemeIcon()}
            </Button>
            <Link href="/login">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-accent/10 text-accent border-accent/30 hover:bg-accent/20">
            Sistema Inteligente
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Gestão de Acessibilidade e Inclusão
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Utilize inteligência artificial para identificar, analisar e resolver barreiras de acessibilidade no ambiente de trabalho.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
                <LogIn className="mr-2 h-5 w-5" />
                Entrar no Sistema
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/registro">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Users className="mr-2 h-5 w-5" />
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground text-center mb-10">
            Recursos do Sistema
          </h3>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-3">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-base">Interface do Operador</CardTitle>
                <CardDescription>
                  Formulário inteligente para relatar barreiras de acessibilidade
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-3">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-base">IA Llama</CardTitle>
                <CardDescription>
                  Análise automática baseada na NBR 9050 e perfil do colaborador
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-3">
                  <Box className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-base">Gêmeo Digital</CardTitle>
                <CardDescription>
                  Visualização 3D das barreiras identificadas na planta
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-3">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-base">Gestão de OS</CardTitle>
                <CardDescription>
                  Controle completo das ordens de serviço e status
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Access Cards */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground text-center mb-10">
            Perfis de Acesso
          </h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="h-full border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl mt-4">Operador / Colaborador</CardTitle>
                <CardDescription className="text-base">
                  Para colaboradores que desejam reportar problemas de acessibilidade ou consultar o status de suas solicitações.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Relatar barreiras de acessibilidade
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Acompanhar status da OS por protocolo
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Visualizar análise da IA
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="h-full border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                    <Shield className="h-7 w-7 text-accent" />
                  </div>
                </div>
                <CardTitle className="text-xl mt-4">Administrador</CardTitle>
                <CardDescription className="text-base">
                  Para gestores e equipe de manutenção visualizarem e gerenciarem todas as ordens de serviço.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Dashboard com métricas e KPIs
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Alterar status das ordens de serviço
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Visualização do Gêmeo Digital
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Configurações de IA
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Link href="/registro">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Criar Conta Agora
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Accessibility className="h-5 w-5 text-accent" />
            <span className="text-sm text-muted-foreground">
              GP-2026 - Sistema de Gestão de Acessibilidade
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              v1.0.0
            </Badge>
            <span className="text-xs text-muted-foreground">
              Powered by Llama 3.3 70B via Groq
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
