'use client'

import { useState } from 'react'

// ÍCONE DISFARÇADO DE MÚSICA PARA A VERSÃO FREE
const MUSIC_ICON = "https://cdn-icons-png.flaticon.com/512/3844/3844724.png"

export default function MusicaBoosterFree() {
  const [step, setStep] = useState<'login' | 'panel'>('login')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if (password.toUpperCase() === "ACESSO-FREE") {
      setStep('panel')
    } else {
      alert('KEY FREE INVÁLIDA!')
    }
  }

  return (
    <div className="fixed inset-0 bg-[#070707] flex flex-col text-zinc-100 font-mono overflow-hidden select-none">
      
      {/* OVERRIDE PARA O NOME DO APP NO NAVEGADOR */}
      <head>
        <title>MUSICA BOOSTER</title>
        <meta name="apple-mobile-web-app-title" content="MUSICA BOOSTER" />
        <link rel="apple-touch-icon" href={MUSIC_ICON} />
        <link rel="icon" href={MUSIC_ICON} />
      </head>

      {step === 'login' && (
        <div className="flex flex-col h-full items-center justify-center p-8 animate-in fade-in">
          <div className="w-24 h-24 mb-6 rounded-full bg-blue-600/10 border-2 border-blue-600/30 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.1)]">
             <img src={MUSIC_ICON} alt="Music Icon" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-xl font-black italic mb-1 tracking-tighter uppercase text-white">Music <span className="text-blue-600">Booster</span></h1>
          <p className="text-[8px] text-zinc-600 mb-10 tracking-[0.5em] uppercase font-bold text-center">Som Estéreo & Equalizador VIP</p>
          
          <input 
            type="text" placeholder="CHAVE DE ACESSO" 
            className="w-full bg-[#111] border border-white/5 p-5 rounded-2xl mb-4 text-center font-bold tracking-widest outline-none focus:border-blue-600/50 uppercase text-white"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-[0.2em] active:scale-95 transition-all">Ativar Booster</button>
        </div>
      )}

      {step === 'panel' && (
        <div className="flex flex-col h-full pt-12 px-6 animate-in fade-in">
          <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
               <img src={MUSIC_ICON} className="w-6 h-6 object-contain" />
               <h1 className="text-[10px] font-black italic text-zinc-400 uppercase">Equalizador <span className="text-blue-600">FREE</span></h1>
            </div>
          </header>

          <div className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 mb-6 text-center">
            <p className="text-[10px] text-zinc-500 uppercase font-bold mb-4">Recursos Disponíveis</p>
            <div className="space-y-3">
               <div className="flex justify-between text-[9px] font-bold py-2 border-b border-white/5">
                  <span>BOOST DE ÁUDIO</span>
                  <span className="text-blue-500">ATIVADO</span>
               </div>
               <div className="flex justify-between text-[9px] font-bold py-2 border-b border-white/5">
                  <span>SINCRONIA DE MIRA</span>
                  <span className="text-blue-500">MÉDIA</span>
               </div>
            </div>
          </div>

          <p className="text-[8px] text-zinc-600 text-center uppercase leading-relaxed">
            Versão gratuita limitada. <br/> Adquira a <b>ROUPAS CHECK VIP</b> para sensibilidade alta e antishake completo.
          </p>
        </div>
      )}
    </div>
  )
}
