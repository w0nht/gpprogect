import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface HistoricoStatus {
  id: number
  ordem_servico_id: number
  status_anterior: string | null
  status_novo: string
  observacao: string | null
  alterado_por: string | null
  created_at: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const historico = await query<HistoricoStatus[]>(
      'SELECT * FROM historico_status WHERE ordem_servico_id = ? ORDER BY created_at DESC',
      [id]
    )

    return NextResponse.json({ success: true, data: historico })
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar histórico' },
      { status: 500 }
    )
  }
}
