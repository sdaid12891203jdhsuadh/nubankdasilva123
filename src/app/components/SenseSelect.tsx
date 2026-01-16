'use client'

export default function SenseSelect({ setView }: any) {
  const senses = ["SENSE FANTASMAIP", "SENSE NOBRU", "SENSE IOS HS", "SENSE ANDROID HS"];

  return (
    <div className="fixed inset-0 bg-[#070707] flex flex-col justify-center p-8 z-30">
      <button onClick={() => setView('os')} className="absolute top-10 left-8 text-zinc-500 text-sm">← Voltar</button>
      
      <h2 className="text-white text-center mb-8 font-bold text-xl uppercase tracking-widest text-[#820AD1]">FAMOUS SENSITIVITY</h2>
      
      <div className="space-y-3">
        {senses.map((name) => (
          <button 
            key={name}
            onClick={() => { alert(`${name} APLICADA!`); setView('os'); }}
            className="w-full bg-[#111] p-5 rounded-2xl flex justify-between text-white font-medium border border-zinc-900 active:scale-95 transition-all"
          >
            <span>{name}</span>
            <span className="text-[#820AD1]">APLICAR</span>
          </button>
        ))}
      </div>
    </div>
  )
}
