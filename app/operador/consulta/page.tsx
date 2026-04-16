'use client'

import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { ConsultaOS } from '@/components/dashboard/consulta-os'

export default function ConsultaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole="operador" />
      
      <div className="pl-64 transition-all duration-300">
        <Header title="Minhas OS" userRole="operador" />
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Título */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Acompanhar Ordem de Serviço
              </h2>
              <p className="text-muted-foreground mt-1">
                Consulte o status das suas solicitações pelo número do protocolo
              </p>
            </div>

            <ConsultaOS />
          </div>
        </main>
      </div>
    </div>
  )
}
