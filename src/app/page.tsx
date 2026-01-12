'use client'

import { useEffect, useMemo, useState } from 'react'

type Device = 'android' | 'ios'

const ACCENT = '#820ad1'
const BG = '#000000'

const VALID_KEYS = ['k1ng', 'K1NG', '123456', 'MAJESTIC-PRO'] 

function Spinner() {
  return (
    <div
      className="h-9 w-9 animate-spin rounded-full border-[3px] border-t-transparent"
      style={{
        borderColor: 'rgba(130,10,209,0.12)',
        borderTopColor: ACCENT,
      }}
      aria-label="Carregando"
    />
  )
}

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(' ')
}

export default function Page() {
  const [stage, setStage] = useState<'login' | 'loading' | 'app'>('login')
  const [key, setKey] = useState('')
  const [device, setDevice] = useState<Device>('android')
  const [applied, setApplied] = useState(false)

  const [c1, setC1] = useState(false)
  const [c2, setC2] = useState(true)
  const [c3, setC3] = useState(false)
  const [c4, setC4] = useState(false)

  const configResult = useMemo(
    () => [
      { label: 'Geral', value: 94 },
      { label: 'Mira 2x', value: 100 },
      { label: 'Mira 4x', value: 98 },
      { label: 'DPI', value: 590 },
    ],
    []
  )

  function handleLogin() {
    const val = key.trim()
    const ok = VALID_KEYS.includes(val) || VALID_KEYS.includes(val.toUpperCase())
    if (!ok) {
      alert('Erro de autenticação: chave inválida.')
      return
    }
    setStage('loading')
    setTimeout(() => setStage('app'), 1200)
  }

  function handleApply() {
    setApplied(false)
    setTimeout(() => {
      setApplied(true)
      if (navigator.vibrate) navigator.vibrate([80, 40, 80])
    }, 1200)
  }

  function handleReset() {
    setStage('login')
    setKey('')
    setApplied(false)
    try {
      sessionStorage.clear()
    } catch {}
  }

  useEffect(() => {
    if (stage !== 'login') return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleLogin()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [stage, key])

  return (
    <div
      className="min-h-[100svh] text-white"
      style={{
        background: BG,
        fontFamily: '-apple-system, system-ui, Segoe UI, Roboto, Arial, sans-serif',
      }}
    >
      <button
        type="button"
        onClick={() => {
          const ok = confirm('Deseja fechar e apagar rastros?')
          if (ok) handleReset()
        }}
        className="fixed right-5 top-5 z-[20000] grid h-[35px] w-[35px] place-items-center rounded-full border"
        style={{
          background: 'rgba(255,255,255,0.05)',
          borderColor: 'rgba(255,255,255,0.10)',
        }}
        aria-label="Reset"
        title="Reset"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>

      {stage === 'login' && (
        <div className="fixed inset-0 z-[10000] flex flex-col px-6 pb-8 pt-16">
<div className="mb-10 flex items-center">
  <img
    src="https://logodownload.org/wp-content/uploads/2019/08/nubank-logo-3.png"
    alt="Nubank"
    className="h-[36px] w-auto"
    style={{ filter: 'brightness(10)' }}
  />
</div>

          <h1 className="mb-9 text-[26px] font-medium leading-[1.15]">
Olá, qual é o seu CPF?
          </h1>

          <div className="mb-1 text-[13px] font-medium" style={{ color: ACCENT }}>
            CPF
          </div>

          <div className="mb-6 border-b-[1.5px]" style={{ borderColor: ACCENT }}>
          <input
  value={key}
  onChange={(e) => setKey(e.target.value)}
              placeholder="000.000.000-00"
  autoFocus
  autoComplete="off"
  inputMode="numeric"
  className="w-full bg-transparent py-2 text-[16px] outline-none placeholder:text-white/25"
/>

          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="mt-auto w-full rounded-full py-[18px] text-[16px] font-semibold transition active:scale-[0.99]"
            style={{ background: ACCENT }}
          >
            Continuar
          </button>
        </div>
      )}

      {stage === 'loading' && (
        <div className="fixed inset-0 z-[10001] grid place-items-center" style={{ background: BG }}>
          <Spinner />
        </div>
      )}

      {stage === 'app' && (
        <div className="mx-auto flex min-h-[100svh] max-w-[520px] flex-col px-5 pb-10 pt-10">
          <div className="mb-7 mt-6">
            <div className="text-[18px] font-semibold">Conta Majestic</div>
            <div className="text-[12px] text-white/50">
              Hardware: <span className="text-white/70">{device === 'android' ? 'Android' : 'iOS'}</span>
            </div>
          </div>

          <div
            className="mb-6 flex gap-1 rounded-xl border p-1"
            style={{ background: '#111', borderColor: '#222' }}
          >
            <button
              type="button"
              onClick={() => setDevice('android')}
              className={cn(
                'flex-1 rounded-[10px] px-3 py-2 text-center text-[12px] font-semibold transition',
                device === 'android' ? 'text-white' : 'text-white/35'
              )}
              style={{ background: device === 'android' ? '#222' : 'transparent', color: device === 'android' ? ACCENT : undefined }}
            >
              ANDROID
            </button>
            <button
              type="button"
              onClick={() => setDevice('ios')}
              className={cn(
                'flex-1 rounded-[10px] px-3 py-2 text-center text-[12px] font-semibold transition',
                device === 'ios' ? 'text-white' : 'text-white/35'
              )}
              style={{ background: device === 'ios' ? '#222' : 'transparent', color: device === 'ios' ? ACCENT : undefined }}
            >
              iOS (iPhone)
            </button>
          </div>

          <div className="mb-5 rounded-2xl border p-5" style={{ background: '#111', borderColor: '#1a1a1a' }}>
            <ToggleRow label="Assist Lock (Head)" checked={c1} onChange={setC1} />
            <ToggleRow label="No Recoil (40% Safety)" checked={c2} onChange={setC2} defaultChecked />
            <ToggleRow label="FPS Boost 120Hz" checked={c3} onChange={setC3} />
            <ToggleRow label="Precision AIM" checked={c4} onChange={setC4} noDivider />
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="w-full rounded-full py-[18px] text-[16px] font-semibold transition active:scale-[0.99]"
            style={{ background: ACCENT, opacity: 0.98 }}
          >
            Aplicar configurações
          </button>
    </div>
      )}
    </div>
  )
}

function ToggleRow({
  label,
  checked,
  onChange,
  noDivider,
  defaultChecked,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  noDivider?: boolean
  defaultChecked?: boolean
}) {
  return (
    <div
      className={cn('flex items-center justify-between py-4', !noDivider && 'border-b')}
      style={{ borderColor: '#222' }}
    >
      <label className="text-[14px] text-white/90">{label}</label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-[22px] w-[22px]"
        style={{ accentColor: ACCENT }}
        aria-label={label}
        data-default-checked={defaultChecked ? 'true' : 'false'}
      />
    </div>
  )
}
