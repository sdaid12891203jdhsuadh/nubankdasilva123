'use client'

import { haptics } from '../utils/haptics'

export default function OSSelect({ setSelectedOs, setView }: any) {
  return (
    <div className="fixed inset-0 bg-[#070707] flex flex-col justify-center p-8 z-25 animate-in fade-in duration-500">
      {/* Botão Voltar */}
      <button 
        onClick={() => { haptics.light(); setView('device_analysis'); }} 
        className="absolute top-8 left-8 text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold hover:scale-110 duration-200 animate-in fade-in slide-in-from-left duration-500"
      >
        <span>←</span> Voltar
      </button>

      <h2 className="text-white text-center mb-8 font-bold text-xl uppercase tracking-widest animate-in slide-in-from-top duration-500 delay-100">Selecione o Sistema</h2>
      <div className="space-y-4">
        <button onClick={() => { haptics.medium(); setSelectedOs('android'); setView('version_select'); }} className="w-full bg-[#111] p-6 rounded-2xl flex justify-between text-white font-bold border border-zinc-900 active:bg-[#1a1a1a] hover:border-[#820AD1]/50 hover:shadow-[0_0_20px_rgba(130,10,209,0.2)] transition-all animate-in slide-in-from-left duration-500 delay-200">
          <span>ANDROID</span><span>→</span>
        </button>
        <button onClick={() => { haptics.medium(); setSelectedOs('ios'); setView('version_select'); }} className="w-full bg-[#111] p-6 rounded-2xl flex justify-between text-white font-bold border border-zinc-900 active:bg-[#1a1a1a] hover:border-[#820AD1]/50 hover:shadow-[0_0_20px_rgba(130,10,209,0.2)] transition-all animate-in slide-in-from-left duration-500 delay-300">
          <span>IOS</span><span>→</span>
        </button>
        
        {/* NOVO BOTÃO DE SENSIBILIDADE */}
        <button onClick={() => { haptics.light(); setView('sense_select'); }} className="w-full bg-[#820AD1]/10 p-6 rounded-2xl flex justify-between text-[#a33df5] font-bold border border-[#820AD1]/30 active:bg-[#820AD1]/20 hover:bg-[#820AD1]/20 transition-all animate-in slide-in-from-left duration-500 delay-400">
          <span>SENSIBILIDADE DOS FAMOSOS </span><span>⭐</span>
        </button>
      </div>
    </div>
  )
}
