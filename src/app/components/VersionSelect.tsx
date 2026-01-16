'use client'

export default function VersionSelect({ setSelectedGame, setView }: any) {
  return (
    <div className="fixed inset-0 bg-[#070707] flex flex-col justify-center p-8 z-25">
      <h2 className="text-white text-center mb-8 font-bold text-xl uppercase tracking-widest">Selecione a Versão</h2>
      <div className="space-y-4">
        <button onClick={() => { setSelectedGame('normal'); setView('panel'); }} className="w-full bg-[#111] p-6 rounded-2xl flex justify-between text-white font-bold border border-zinc-900 active:bg-[#1a1a1a]">
          <span>FREE FIRE NORMAL</span><span>→</span>
        </button>
        <button onClick={() => { setSelectedGame('max'); setView('panel'); }} className="w-full bg-[#111] p-6 rounded-2xl flex justify-between text-white font-bold border border-zinc-900 active:bg-[#1a1a1a]">
          <span>FREE FIRE MAX</span><span>→</span>
        </button>
      </div>
    </div>
  )
}
