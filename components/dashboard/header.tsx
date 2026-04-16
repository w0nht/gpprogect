'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/auth/auth-context'
import { Sun, Moon, Contrast, Bell, LogOut } from 'lucide-react'

interface HeaderProps {
  title: string
  userRole: 'operador' | 'administrador'
}

export function Header({ title, userRole }: HeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>('light')
  const { user, logout } = useAuth()

  useEffect(() => {
    const saved = localStorage.getItem('gp2026-theme') as 'light' | 'dark' | 'high-contrast' | null
    if (saved) {
      setTheme(saved)
      applyTheme(saved)
    }
  }, [])

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
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'high-contrast':
        return <Contrast className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark':
        return 'Escuro'
      case 'high-contrast':
        return 'Alto Contraste'
      default:
        return 'Claro'
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <Badge 
          variant="outline" 
          className="hidden sm:flex border-accent text-accent"
        >
          {userRole === 'operador' ? 'Operador' : 'Administrador'}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        {user && (
          <span className="hidden lg:block text-sm text-muted-foreground mr-2">
            {user.nome}
          </span>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={cycleTheme}
          className="flex items-center gap-2"
          title={`Tema: ${getThemeLabel()}`}
        >
          {getThemeIcon()}
          <span className="hidden md:inline text-sm">{getThemeLabel()}</span>
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
            3
          </span>
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout}
          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
          title="Sair"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
