'use client'

import { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)

  const isNotFoundPage = pathname === '/_not-found'

  useEffect(() => {
    if (isNotFoundPage) return

    setIsNavigating(true)

    const timer = setTimeout(() => {
      setIsNavigating(false)
    }, 400)

    const handleLoad = () => {
      setIsNavigating(false)
      clearTimeout(timer)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad, { once: true })
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('load', handleLoad)
    }
  }, [pathname, searchParams, isNotFoundPage])

  return (
    <>
      {/* Alterado para fundo preto para combinar com o tema VIP */}
      {isNavigating && !isNotFoundPage && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#820ad1]/20 border-t-[#820ad1]" />
        </div>
      )}

      <div
        className={[
          'min-h-screen bg-black font-sans antialiased',
          isNavigating && !isNotFoundPage ? 'pointer-events-none' : '',
        ].join(' ')}
      >
        {children}
      </div>
    </>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Título e Meta Tags limpas de qualquer rastro de banco */}
        <title>Portal de Acessos</title>
        <meta name="description" content="Gestão de performance e acessos para parceiros." />
        <meta name="apple-mobile-web-app-title" content="Portal" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Link para o Manifest que você criou na pasta public */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Ícone genérico de sacola/portal para o navegador */}
        <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/3050/3050222.png" />
        <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/3050/3050222.png" />
      </head>

      <body className={['font-sans bg-black', inter.variable].join(' ')}>
        <Suspense fallback={null}>
          <LayoutContent>{children}</LayoutContent>
        </Suspense>
      </body>
    </html>
  )
}
