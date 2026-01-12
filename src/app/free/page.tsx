'use client'

import { useState } from 'react'

const SPOTIFY_GREEN = '#1DB954'
const BG_GRADIENT = 'linear-gradient(180deg, #121212 0%, #000000 100%)'

export default function SpotifyLite() {
  const [step, setStep] = useState('login') // login, home
  const [password, setPassword] = useState('')
  const [injections, setInjections] = useState(0)
  const [isInjecting, setIsInjecting] = useState(false)
  const [os, setOs] = useState('android')

  const handleLogin = () => {
    if (password.toUpperCase() === 'ACESSO-FREE') {
      setStep('home')
    } else {
      alert('Senha incorreta! Use: ACESSO-FREE')
    }
  }

  const handleInject = () => {
    if (injections >= 1) {
      alert("DEMONSTRAÇÃO EXPIRADA: Adquira a Key VIP para acesso ilimitado e Aimlock 100%.")
      window.location.href = "https://wa.me/seunumero"
      return
    }
    setIsInjecting(true)
    setTimeout(() => {
      setIsInjecting(false)
      setInjections(1)
      alert("Versão LITE aplicada com sucesso!")
    }, 3000)
  }

  if (step === 'login') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center p-8 bg-black text-white font-sans">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="white" className="mb-8"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>
        <h1 className="text-2xl font-black mb-10 text-center">Entrar no Majestic Booster</h1>
        
        <div className="w-full space-y-4">
          <input 
            type="text" 
            placeholder="Senha de acesso" 
            className="w-full bg-[#333] p-4 rounded-md outline-none focus:ring-2 ring-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            onClick={handleLogin}
            className="w-full bg-[#1DB954] text-black font-bold py-4 rounded-full uppercase tracking-widest text-sm"
          >
            Entrar
          </button>
        </div>
        <p className="mt-6 text-gray-500 text-[10px] uppercase font-bold tracking-widest">A senha é: ACESSO-FREE</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col text-white select-none overflow-hidden" style={{ background: BG_GRADIENT }}>
      
      {/* Header Spotify */}
      <div className="pt-12 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="black"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>
           </div>
           <h1 className="font-bold text-xl tracking-tight">Suas Configurações</h1>
        </div>
      </div>

      <div className="flex-1 px-6 pt-8 space-y-8 overflow-y-auto">
        
        {/* Selector de Sistema */}
        <div className="flex gap-2 p-1 bg-[#222] rounded-lg">
           <button onClick={() => setOs('android')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${os === 'android' ? 'bg-[#333] text-white shadow-xl' : 'text-gray-500'}`}>ANDROID</button>
           <button onClick={() => setOs('ios')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${os === 'ios' ? 'bg-[#333] text-white shadow-xl' : 'text-gray-500'}`}>IOS (BETA)</button>
        </div>

        {/* Funções */}
        <div className="space-y-6">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Aimlock (Suave)</span>
              <span className="text-[#1DB954] text-xs font-bold">30% FIXED</span>
            </div>
            <div className="h-1.5 w-full bg-[#333] rounded-full">
              <div className="h-full bg-[#1DB954] w-[30%]"></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">Estabilizar FPS</div>
              <div className="text-[11px] text-gray-400 font-medium italic">Otimização {os.toUpperCase()} ativa</div>
            </div>
            <div className="w-12 h-6 bg-[#1DB954] rounded-full flex items-center px-1 shadow-[0_0_10px_#1DB954]">
               <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
            </div>
          </div>

          <div className="flex justify-between items-center opacity-40">
            <div>
              <div className="font-bold">Norecoil Seguro</div>
              <div className="text-[11px] text-red-500 font-bold uppercase tracking-tighter">Bloqueado na versão Free</div>
            </div>
            <input type="checkbox" disabled className="w-6 h-6 border-gray-600 accent-gray-600 rounded" />
          </div>
        </div>
      </div>

      {/* Player de Música inferior */}
      <div className="bg-[#181818] p-6 pb-12 rounded-t-3xl shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#1DB954] to-[#000] rounded shadow-lg flex items-center justify-center">
             <span className="font-black text-2xl italic">M</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold">Majestic Lite - {os === 'android' ? 'APK' : 'IPA'}</div>
            <div className="text-xs text-gray-500">Aguardando play para injetar...</div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
             <div className="h-full bg-white transition-all duration-[3000ms]" style={{ width: isInjecting ? '100%' : '0%' }}></div>
          </div>
          
          <button 
            onClick={handleInject}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center active:scale-90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isInjecting ? (
              <div className="w-6 h-6 border-3 border-black border-t-transparent animate-spin rounded-full"></div>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
