'use client'

import { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const META_PIXEL_ID = '868874045516079'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)

  // ✅ evita rodar em "not found" (isso aqui raramente é '/_not-found' de verdade)
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

  useEffect(() => {
    if (isNotFoundPage) return
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      ;(window as any).fbq('track', 'PageView')
    }
  }, [pathname, searchParams, isNotFoundPage])

  return (
    <>
      {/* Overlay de navegação */}
      {isNavigating && !isNotFoundPage && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white">
          <div className="loading-spinner" />
        </div>
      )}

      {/* Container */}
      <div
        className={[
          'min-h-screen bg-background font-sans antialiased',
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
        <title>Portal</title>
        <meta name="description" content="Portal-Afiliados" />
        <meta name="robots" content="index, follow" />
      </head>

      <body className={['font-sans', inter.variable].join(' ')}>
        <noscript>
        </noscript>

        <Suspense fallback={null}>
          <LayoutContent>{children}</LayoutContent>
        </Suspense>
      </body>
    </html>
  )
}
