'use client'

import { useState } from 'react'

// Ícone genérico de música (substituindo o logo do Spotify)
const ICON_MUSIC = "https://cdn-icons-png.flaticon.com/512/3844/3844724.png"

export default function MusicFree() {
  const [step, setStep] = useState('login')
  const [password, setPassword] = useState('')
  const [aimValue, setAimValue] = useState(15)
  const [os, setOs] = useState('ios')
  const [logs, setLogs] = useState(['> Player carregado...', '> Aguardando login...'])

  const handleLogin = () => {
    if (password.toUpperCase() === 'ACESSO-FREE') {
      setStep('home')
    } else {
      alert('Chave inválida!')
    }
  }

  return (
    <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden select-none">
      <head>
        <title>Music Player</title>
        <meta name="apple-mobile-web-app-title" content="Music" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
      </head>

      {step === 'login' ? (
        <div className="flex flex-col h-full items-center justify-center p-8 text-center">
          <img src={ICON_MUSIC} className="w-20 h-20 mb-8 opacity-50" />
          <h1 className="text-2xl font-black mb-10 tracking-tighter uppercase">Music Booster</h1>
          <input 
            type="password" placeholder="Chave de Acesso" 
            className="w-full bg-[#121212] border border-[#333] p-4 rounded-xl mb-4 outline-none focus:border-[#1DB954]"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full bg-[#1DB954] text-black font-bold py-4 rounded-full uppercase text-xs tracking-widest">Entrar</button>
        </div>
      ) : (
        <div className="flex flex-col h-full pt-12 px-6">
           <div className="flex items-center gap-4 mb-8">
             <img src={ICON_MUSIC} className="w-10 h-10 opacity-50" />
             <h1 className="text-xl font-bold">Performance LITE</h1>
           </div>
           
           {/* Slider de Aimlock (Trava de 30% mantida) */}
           <div className="bg-[#121212] p-4 rounded-2xl border border-white/5 mb-6">
              <div className="flex justify-between mb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Aimlock Soft</span>
                <span className="text-[#1DB954] font-bold">{aimValue}%</span>
              </div>
              <input type="range" min="0" max="100" value={aimValue} onChange={(e) => {
                const v = parseInt(e.target.value);
                setAimValue(v > 30 ? 30 : v);
              }} className="w-full h-1 bg-[#333] appearance-none accent-[#1DB954]" />
           </div>
           
           <p className="text-[9px] text-gray-500 text-center uppercase tracking-widest mt-auto pb-10">Versão Free: Recursos Limitados</p>
        </div>
      )}
    </div>
  )
}
