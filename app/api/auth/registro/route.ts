import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, registerUser, createSession } from '@/lib/auth-server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { nome, email, senha, cargo, tipo_pcd, setor } = data

    if (!nome || !email || !senha || !cargo) {
      return NextResponse.json(
        { error: 'Nome, email, senha e cargo são obrigatórios' },
        { status: 400 }
      )
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    if (!['operador', 'administrador'].includes(cargo)) {
      return NextResponse.json(
        { error: 'Cargo inválido' },
        { status: 400 }
      )
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 409 }
      )
    }

    const user = await registerUser({
      nome,
      email,
      senha,
      cargo,
      tipo_pcd,
      setor
    })

    const sessionToken = await createSession(user.id)
    
    const cookieStore = await cookies()
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user,
      redirectTo: cargo === 'administrador' ? '/admin' : '/operador'
    })

  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
