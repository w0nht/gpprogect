'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-context'
import {
  LayoutDashboard,
  Box,
  Users,
  ChevronLeft,
  ChevronRight,
  Accessibility,
  FileText,
  Brain,
  LogOut,
  User
} from 'lucide-react'

interface SidebarProps {
  userRole: 'operador' | 'administrador'
}

const menuItemsOperador = [
  { href: '/operador', label: 'Novo Relato', icon: FileText },
  { href: '/operador/consulta', label: 'Minhas OS', icon: Accessibility },
]

const menuItemsAdmin = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/gemeo-digital', label: 'Mapa 3D (Gêmeo)', icon: Box },
  { href: '/admin/colaboradores', label: 'Colaboradores', icon: Users },
  { href: '/admin/configuracoes', label: 'Configurações de IA', icon: Brain },
]

export function Sidebar({ userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const menuItems = userRole === 'operador' ? menuItemsOperador : menuItemsAdmin

  const handleLogout = async () => {
    await logout()
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <Accessibility className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-sidebar-foreground">GP-2026</span>
                <span className="text-[10px] text-sidebar-foreground/70">IA & Gêmeo Digital</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Accessibility className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
          )}
        </div>

        {/* User Info */}
        {user && (
          <div className={cn(
            'border-b border-sidebar-border p-4',
            collapsed && 'flex justify-center'
          )}>
            {!collapsed ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
                  <User className="h-5 w-5 text-sidebar-accent-foreground" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-sidebar-foreground truncate">
                    {user.nome}
                  </span>
                  <span className="text-xs text-sidebar-foreground/60 truncate">
                    {user.email}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent" title={user.nome}>
                <User className="h-5 w-5 text-sidebar-accent-foreground" />
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          <div className={cn('mb-4 px-2', collapsed && 'text-center')}>
            <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              {collapsed ? '•' : userRole === 'operador' ? 'Operador' : 'Administrador'}
            </span>
          </div>
          
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-sidebar-border p-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Sair</span>}
          </Button>
        </div>

        {/* Collapse Button */}
        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Recolher
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}
