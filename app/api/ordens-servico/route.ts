import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import type { OrdemServico, AnaliseIA } from '@/lib/types'
import type { ResultSetHeader } from 'mysql2'

function generateProtocolo(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `OS-${year}-${random}`
}

async function analyzeWithLlama(problema: string, tipoPcd: string): Promise<AnaliseIA | null> {
  const apiKey = process.env.GROQ_API_KEY
  
  if (!apiKey) {
    console.warn('GROQ_API_KEY não configurada, retornando análise simulada')
    return {
      analise: `Análise baseada no perfil do colaborador (${tipoPcd}) e cruzamento com NBR 9050:2020. O problema relatado indica uma barreira física que compromete a acessibilidade do colaborador.`,
      norma_referencia: 'NBR 9050:2020',
      barreira_detectada: 'Barreira física identificada que impede ou dificulta o acesso/uso adequado do espaço pelo colaborador.',
      localizacao_conflito: 'Localização a ser verificada in loco pela equipe de manutenção.',
      sugestoes: [
        'Realizar vistoria técnica no local',
        'Adequar o mobiliário/estrutura conforme NBR 9050',
        'Implementar solução de acessibilidade adequada ao tipo de deficiência'
      ],
      parametros_tecnicos: 'Verificar conformidade com NBR 9050:2020 e legislação vigente.'
    }
  }

  try {
    const systemPrompt = `Você é um especialista em acessibilidade e inclusão, com profundo conhecimento da NBR 9050:2020 (Acessibilidade a edificações, mobiliário, espaços e equipamentos urbanos).

Sua função é analisar problemas de acessibilidade reportados por colaboradores PCD e fornecer:
1. Análise técnica do problema
2. Referência à norma NBR 9050 aplicável
3. Identificação da barreira física/arquitetônica
4. Localização do conflito
5. Sugestões de solução

Parâmetros técnicos importantes da NBR 9050:
- Alcance manual para cadeirantes: altura entre 0,40m e 1,20m
- Largura mínima de corredores: 1,20m
- Portas: mínimo 0,80m de vão livre
- Rampas: inclinação máxima 8,33%
- Sinalização tátil: piso podotátil de alerta e direcional
- Sinalização visual: contraste mínimo de 70%
- Altura de balcões acessíveis: entre 0,75m e 0,85m

Responda SEMPRE em formato JSON válido.`

    const userPrompt = `Analise o seguinte problema de acessibilidade:

Perfil do Colaborador: ${tipoPcd}
Problema Relatado: ${problema}

Responda em JSON com a seguinte estrutura:
{
  "analise": "análise técnica detalhada do problema",
  "norma_referencia": "seção específica da NBR 9050 aplicável",
  "barreira_detectada": "descrição técnica da barreira identificada",
  "localizacao_conflito": "onde exatamente está o problema",
  "sugestoes": ["lista de sugestões de solução"],
  "parametros_tecnicos": "parâmetros técnicos que devem ser observados"
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1024,
        response_format: { type: 'json_object' }
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content
    
    if (content) {
      return JSON.parse(content) as AnaliseIA
    }
    
    return null
  } catch (error) {
    console.error('Erro na análise com Llama:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const protocolo = searchParams.get('protocolo')

    let sql = 'SELECT * FROM ordens_servico'
    const params: string[] = []

    if (status) {
      sql += ' WHERE status = ?'
      params.push(status)
    }

    if (protocolo) {
      sql += params.length ? ' AND protocolo LIKE ?' : ' WHERE protocolo LIKE ?'
      params.push(`%${protocolo}%`)
    }

    sql += ' ORDER BY created_at DESC'

    const ordens = await query<OrdemServico[]>(sql, params)
    
    return NextResponse.json({ success: true, data: ordens })
  } catch (error) {
    console.error('Erro ao buscar ordens de serviço:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar ordens de serviço' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { colaborador_nome, colaborador_tipo_pcd, setor, descricao_problema } = body

    if (!colaborador_nome || !setor || !descricao_problema) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      )
    }

    const protocolo = generateProtocolo()
    
    // Análise com IA
    const analise = await analyzeWithLlama(descricao_problema, colaborador_tipo_pcd || 'Não especificado')

    const sql = `
      INSERT INTO ordens_servico (
        protocolo,
        colaborador_nome,
        colaborador_tipo_pcd,
        setor,
        descricao_problema,
        analise_ia,
        norma_referencia,
        barreira_detectada,
        localizacao_conflito,
        sugestao_ia,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      protocolo,
      colaborador_nome,
      colaborador_tipo_pcd || null,
      setor,
      descricao_problema,
      analise?.analise || null,
      analise?.norma_referencia || null,
      analise?.barreira_detectada || null,
      analise?.localizacao_conflito || null,
      analise ? JSON.stringify(analise.sugestoes) : null,
      'pendente'
    ]

    const result = await query<ResultSetHeader>(sql, params)
    
    // Registrar no histórico
    await query(
      'INSERT INTO historico_status (ordem_servico_id, status_novo, observacao) VALUES (?, ?, ?)',
      [result.insertId, 'pendente', 'Ordem de serviço criada']
    )

    return NextResponse.json({ 
      success: true, 
      data: {
        id: result.insertId,
        protocolo,
        analise
      },
      message: 'Ordem de serviço criada com sucesso'
    })
  } catch (error) {
    console.error('Erro ao criar ordem de serviço:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar ordem de serviço' },
      { status: 500 }
    )
  }
}
