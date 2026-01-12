'use client'

import { useState } from 'react'

const SPOTIFY_LOGO = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4B9Q87OShMm7Y4KXBY3Zt25fCmjKTElQwhg&s"

export default function SpotifyLite() {
  const [step, setStep] = useState('login')
  const [password, setPassword] = useState('')
  const [aimValue, setAimValue] = useState(15)
  const [os, setOs] = useState('android')
  const [fpsActive, setFpsActive] = useState(false)
  const [logs, setLogs] = useState(['> Majestic LITE carregado...', '> Aguardando login...'])
  const [isInjecting, setIsInjecting] = useState(false)

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-3), `> ${msg}`])
  }

  const handleLogin = () => {
    if (password.toUpperCase() === 'ACESSO-FREE') {
      setStep('home')
      addLog('Dispositivo autenticado!')
    } else {
      alert('Senha incorreta!')
    }
  }

  const handleAimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    if (val > 30) {
      addLog('LIMITE FREE: 30% DE AIMLOCK')
      setAimValue(30)
    } else {
      setAimValue(val)
      addLog(`Ajuste: ${val}%`)
    }
  }

  const handleInject = () => {
    setIsInjecting(true)
    addLog(`Conectando ao Free Fire Brasil...`)
    setTimeout(() => {
      setIsInjecting(false)
      addLog('SUCESSO! Abrindo o jogo...')
      setTimeout(() => {
        if (os === 'android') {
          window.location.href = "intent://#Intent;package=com.dts.freefireth;scheme=android-app;end"
        } else {
          // Link corrigido com o ID enviado: 1300146617
          window.location.href = "https://apps.apple.com/br/app/free-fire/id1300146617"
        }
      }, 1500)
    }, 3000)
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-black text-white font-sans overflow-hidden select-none">
      {/* CORREÇÃO DA BARRA BRANCA E TELA CHEIA */}
      <head>
        <title>Spotify</title>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Spotify" />
        <link rel="apple-touch-icon" href={SPOTIFY_LOGO} />
      </head>

      <style jsx global>{`
        html, body { background: black !important; margin: 0; padding: 0; }
        :root { --sat: env(safe-area-inset-top); }
        .main-container { padding-top: var(--sat); }
      `}</style>

      {step === 'login' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in">
          <img src={SPOTIFY_LOGO} className="w-20 h-20 mb-8 rounded-full shadow-[0_0_20px_rgba(29,185,84,0.3)]" />
          <h1 className="text-2xl font-black mb-10 tracking-tighter">MAJESTIC BOOSTER</h1>
          <input 
            type="password" placeholder="Senha de acesso" 
            className="w-full bg-[#121212] border border-[#333] p-4 rounded-md mb-4 outline-none focus:border-[#1DB954]"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full bg-[#1DB954] text-black font-bold py-4 rounded-full uppercase text-sm">Entrar</button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col main-container">
          {/* Header */}
          <div className="pt-8 px-6 pb-4 border-b border-white/5 flex items-center gap-4">
            <img src={SPOTIFY_LOGO} className="w-10 h-10 rounded-full" />
            <div>
              <h2 className="text-[10px] font-black text-[#1DB954] uppercase">MAJESTIC PERFORMANCE</h2>
              <h1 className="text-xl font-bold">Modo Lite</h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pt-6 space-y-6 pb-32">
            {/* Seletor de Sistema */}
            <div className="flex gap-2 p-1 bg-[#121212] rounded-lg border border-white/5">
               <button onClick={() => setOs('android')} className={`flex-1 py-2 rounded-md text-[10px] font-black ${os === 'android' ? 'bg-[#333] text-[#1DB954]' : 'text-gray-600'}`}>ANDROID</button>
               <button onClick={() => setOs('ios')} className={`flex-1 py-2 rounded-md text-[10px] font-black ${os === 'ios' ? 'bg-[#333] text-[#1DB954]' : 'text-gray-600'}`}>IOS (BRASIL)</button>
            </div>

            {/* Aimlock */}
            <div className="bg-[#121212] p-4 rounded-xl border border-white/5 shadow-lg">
              <div className="flex justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase">Aimlock Suave</span>
                <span className="text-[#1DB954] font-mono font-bold">{aimValue}%</span>
              </div>
              <input type="range" min="0" max="100" value={aimValue} onChange={handleAimChange} className="w-full h-1 bg-[#333] appearance-none accent-[#1DB954]" />
            </div>

            {/* Opções que tinham sumido */}
            <div className="space-y-3">
              <div onClick={() => {setFpsActive(!fpsActive); addLog(fpsActive ? 'FPS Boost: OFF' : 'FPS Boost: ON');}} className="flex justify-between items-center bg-[#121212] p-4 rounded-xl border border-white/5 active:bg-white/5">
                <span className="text-sm font-bold">Otimizar FPS (120 FPS)</span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${fpsActive ? 'bg-[#1DB954]' : 'bg-gray-700'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${fpsActive ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>

              <div onClick={() => addLog('VIP: Regedit bloqueado na versão FREE')} className="flex justify-between items-center bg-[#121212] p-4 rounded-xl border border-white/5 opacity-50 border-dashed">
                <span className="text-sm font-bold text-red-500 uppercase tracking-tighter">Regedit "Apenas Cabeça"</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#555"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/></svg>
              </div>
            </div>

            {/* Logs */}
            <div className="bg-[#050505] p-3 rounded border border-[#1DB954]/20 font-mono text-[10px] text-[#1DB954] space-y-1">
              {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
          </div>

          {/* Botão de Injeção */}
          <div className="p-6 pb-12 flex flex-col items-center gap-4 bg-black border-t border-white/5">
            <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
               <div className="h-full bg-[#1DB954] transition-all duration-[3000ms]" style={{ width: isInjecting ? '100%' : '0%' }}></div>
            </div>
            <button onClick={handleInject} className="w-14 h-14 bg-white rounded-full flex items-center justify-center active:scale-90 transition-all">
              {isInjecting ? <div className="w-5 h-5 border-2 border-black border-t-transparent animate-spin rounded-full"></div> : <svg width="24" height="24" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z"/></svg>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
