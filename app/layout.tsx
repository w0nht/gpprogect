import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/auth/auth-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'GP-2026 | IA & Gêmeo Digital - Gestão de Acessibilidade',
  description: 'Sistema inteligente de gestão de acessibilidade e inclusão com IA e Gêmeo Digital',
  icons: {
    icon: [
      {
        url: '',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '',
        type: 'image/svg+xml',
      },
    ],
    apple: '',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
