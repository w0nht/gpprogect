import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import type { OrdemServico, OSStatus } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const ordens = await query<OrdemServico[]>(
      'SELECT * FROM ordens_servico WHERE id = ?',
      [id]
    )

    if (ordens.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: ordens[0] })
  } catch (error) {
    console.error('Erro ao buscar ordem de serviço:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar ordem de serviço' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, observacao, alterado_por } = body as {
      status: OSStatus
      observacao?: string
      alterado_por?: string
    }

    // Buscar status atual
    const ordens = await query<OrdemServico[]>(
      'SELECT status FROM ordens_servico WHERE id = ?',
      [id]
    )

    if (ordens.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      )
    }

    const statusAnterior = ordens[0].status

    // Atualizar status
    await query(
      'UPDATE ordens_servico SET status = ? WHERE id = ?',
      [status, id]
    )

    // Registrar no histórico
    await query(
      `INSERT INTO historico_status 
       (ordem_servico_id, status_anterior, status_novo, observacao, alterado_por) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, statusAnterior, status, observacao || null, alterado_por || 'Administrador']
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Status atualizado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao atualizar ordem de serviço:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar ordem de serviço' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await query('DELETE FROM ordens_servico WHERE id = ?', [id])

    return NextResponse.json({ 
      success: true, 
      message: 'Ordem de serviço excluída com sucesso'
    })
  } catch (error) {
    console.error('Erro ao excluir ordem de serviço:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir ordem de serviço' },
      { status: 500 }
    )
  }
}
