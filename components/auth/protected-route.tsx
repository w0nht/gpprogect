'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-context'
import { UserRole } from '@/lib/types'
import { Loader2, Brain } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  // Controla se já tentamos redirecionar ao menos uma vez após o loading terminar
  const redirectedRef = useRef(false)

  useEffect(() => {
    if (loading) return

    if (!user) {
      if (!redirectedRef.current) {
        redirectedRef.current = true
        router.push('/login')
      }
      return
    }

    if (allowedRoles && !allowedRoles.includes(user.cargo)) {
      if (!redirectedRef.current) {
        redirectedRef.current = true
        router.push(user.cargo === 'administrador' ? '/admin' : '/operador')
      }
    }
  }, [user, loading, router, allowedRoles])

  // Reset do ref quando o usuário loga novamente
  useEffect(() => {
    if (user) {
      redirectedRef.current = false
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 animate-pulse">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Verificando acesso...
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  if (allowedRoles && !allowedRoles.includes(user.cargo)) return null

  return <>{children}</>
}
