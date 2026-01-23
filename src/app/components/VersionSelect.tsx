'use client'

import { haptics } from '../utils/haptics'

export default function VersionSelect({ setSelectedGame, setView }: any) {
  return (
    <div className="fixed inset-0 bg-[#070707] flex flex-col justify-center p-8 z-25 animate-in fade-in duration-500">
      {/* Botão Voltar */}
      <button 
        onClick={() => { haptics.light(); setView('os'); }} 
        className="absolute top-8 left-8 text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold hover:scale-110 duration-200 animate-in fade-in slide-in-from-left duration-500"
      >
        <span>←</span> Voltar
      </button>

      <h2 className="text-white text-center mb-8 font-bold text-xl uppercase tracking-widest animate-in slide-in-from-top duration-500 delay-100">Selecione a Versão</h2>
      <div className="space-y-4">
        <button onClick={() => { haptics.medium(); setSelectedGame('normal'); setView('panel'); }} className="w-full bg-[#111] p-6 rounded-2xl flex justify-between text-white font-bold border border-zinc-900 active:bg-[#1a1a1a] hover:border-[#820AD1]/50 hover:shadow-[0_0_20px_rgba(130,10,209,0.2)] transition-all animate-in slide-in-from-left duration-500 delay-200">
          <span>FREE FIRE NORMAL</span><span>→</span>
        </button>
        <button onClick={() => { haptics.medium(); setSelectedGame('max'); setView('panel'); }} className="w-full bg-[#111] p-6 rounded-2xl flex justify-between text-white font-bold border border-zinc-900 active:bg-[#1a1a1a] hover:border-[#820AD1]/50 hover:shadow-[0_0_20px_rgba(130,10,209,0.2)] transition-all animate-in slide-in-from-left duration-500 delay-300">
          <span>FREE FIRE MAX</span><span>→</span>
        </button>
      </div>
    </div>
  )
}
