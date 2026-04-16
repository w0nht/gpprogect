'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'

export default function OperadorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['operador']}>
      {children}
    </ProtectedRoute>
  )
}
