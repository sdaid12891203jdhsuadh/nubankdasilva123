'use client'

import { useState, useEffect } from 'react'

const SPOTIFY_GREEN = '#1DB954'
const SPOTIFY_LOGO = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4B9Q87OShMm7Y4KXBY3Zt25fCmjKTElQwhg&s"

export default function SpotifyLite() {
  const [step, setStep] = useState('login')
  const [password, setPassword] = useState('')
  const [aimValue, setAimValue] = useState(15)
  const [os, setOs] = useState('android')
  const [logs, setLogs] = useState(['> Sistema iniciado...', '> Aguardando autenticação...'])
  const [isInjecting, setIsInjecting] = useState(false)

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `> ${msg}`])
  }

  const handleLogin = () => {
    if (password.toUpperCase() === 'ACESSO-FREE') {
      setStep('home')
      addLog('Login efetuado: Versão LITE')
    } else {
      alert('Senha incorreta!')
    }
  }

  const handleAimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    if (val > 30) {
      addLog('ERRO: Limite de 30% na versão FREE')
      setAimValue(30)
    } else {
      setAimValue(val)
      addLog(`Aimlock ajustado: ${val}%`)
    }
  }

  if (step === 'login') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center p-8 bg-black text-white font-sans">
        <img src={SPOTIFY_LOGO} className="w-20 h-20 mb-8 rounded-full shadow-[0_0_30px_rgba(29,185,84,0.4)]" />
        <h1 className="text-2xl font-black mb-10 text-center uppercase tracking-tighter">Majestic Booster</h1>
        
        <div className="w-full space-y-4">
          <input 
            type="password" 
            placeholder="Senha de acesso" 
            className="w-full bg-[#121212] border border-[#333] p-4 rounded-md outline-none focus:border-[#1DB954] transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full bg-[#1DB954] text-black font-bold py-4 rounded-full uppercase tracking-widest text-sm active:scale-95 transition-all">Entrar</button>
        </div>
        <a href="https://discord.gg/majesticos" className="mt-8 text-gray-500 text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors">
          Senha em: <span className="text-[#1DB954] underline">discord.gg/majesticos</span>
        </a>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-black text-white font-sans overflow-hidden select-none">
      
      {/* Header Estilo Spotify */}
      <div className="pt-10 px-6 pb-4 border-b border-white/5 flex items-center gap-4">
        <img src={SPOTIFY_LOGO} className="w-10 h-10 rounded-full" />
        <div>
          <h2 className="text-[10px] font-black text-[#1DB954] uppercase tracking-widest">Painel de Controle</h2>
          <h1 className="text-xl font-bold">LITE EDITION</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 space-y-6 pb-40">
        
        {/* Aimlock Ajustável */}
        <div className="bg-[#121212] p-4 rounded-xl border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold uppercase tracking-tighter">Aimlock Suave</span>
            <span className="text-[#1DB954] font-mono text-sm">{aimValue}%</span>
          </div>
          <input 
            type="range" min="0" max="100" value={aimValue} onChange={handleAimChange}
            className="w-full h-1.5 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
          />
          <p className="text-[10px] text-gray-500 mt-2 italic">* Máximo 30% na versão gratuita</p>
        </div>

        {/* Opções Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#121212] p-3 rounded-lg border border-white/5">
            <div className="text-[10px] text-gray-500 font-bold mb-1">FPS</div>
            <div className="text-xs font-bold text-green-500">ESTÁVEL</div>
          </div>
          <div onClick={() => addLog('VIP: Regedit 2026 Bloqueado')} className="bg-[#121212] p-3 rounded-lg border border-white/5 opacity-50">
            <div className="text-[10px] text-gray-500 font-bold mb-1">REGEDIT</div>
            <div className="text-xs font-bold text-red-500">VIP APENAS</div>
          </div>
        </div>

        {/* Checkboxes Simples */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#121212] p-4 rounded-xl border border-white/5">
            <span className="text-sm font-bold opacity-40 italic underline">Antena 100% Head</span>
            <div className="w-4 h-4 rounded border border-gray-600"></div>
          </div>
          <div className="flex justify-between items-center bg-[#121212] p-4 rounded-xl border border-white/5">
            <span className="text-sm font-bold">Otimizar Motor {os === 'android' ? 'Unity' : 'Swift'}</span>
            <div className="w-5 h-5 bg-[#1DB954] rounded flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="black"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
          </div>
        </div>

        {/* Logs Estilo Spotify Terminal */}
        <div className="bg-black/50 p-4 rounded-lg font-mono text-[10px] text-[#1DB954] space-y-1 border border-[#1DB954]/20">
          {logs.map((log, i) => <div key={i}>{log}</div>)}
        </div>
      </div>

      {/* Player de Injeção */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#181818] p-6 pb-10 border-t border-white/5">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full h-1 bg-gray-800 rounded-full">
            <div className="h-full bg-[#1DB954] transition-all duration-[3000ms]" style={{ width: isInjecting ? '100%' : '0%' }}></div>
          </div>
          <button 
            onClick={() => {
              setIsInjecting(true)
              addLog('Injetando módulos LITE...')
              setTimeout(() => { setIsInjecting(false); addLog('SUCESSO! Free Fire Otimizado'); }, 3000)
            }}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center active:scale-90 transition-all"
          >
            {isInjecting ? <div className="w-5 h-5 border-2 border-black border-t-transparent animate-spin rounded-full"></div> : <svg width="24" height="24" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z"/></svg>}
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Executar Injeção</span>
        </div>
      </div>
    </div>
  )
}
