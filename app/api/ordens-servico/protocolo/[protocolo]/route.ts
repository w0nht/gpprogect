import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import type { OrdemServico } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ protocolo: string }> }
) {
  try {
    const { protocolo } = await params
    
    const ordens = await query<OrdemServico[]>(
      'SELECT * FROM ordens_servico WHERE protocolo = ?',
      [protocolo]
    )

    if (ordens.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: ordens[0] })
  } catch (error) {
    console.error('Erro ao buscar ordem de serviço por protocolo:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar ordem de serviço' },
      { status: 500 }
    )
  }
}
