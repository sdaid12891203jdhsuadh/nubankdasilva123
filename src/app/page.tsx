'use client'

import { useState } from 'react'

// Ícone discreto de sacola/loja para o disfarce
const ICON_LOJA = "https://cdn-icons-png.flaticon.com/512/3050/3050222.png"

export default function PaginaAfiliados() {
  const [stage, setStage] = useState<'login' | 'loading' | 'dashboard'>('login')
  const [key, setKey] = useState('')
  const [os, setOs] = useState<'android' | 'ios'>('ios')
  const [phoneModel, setPhoneModel] = useState('')
  const [senseType, setSenseType] = useState<'ALTA' | 'BAIXA'>('ALTA')
  const [generatedSense, setGeneratedSense] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [isInjecting, setIsInjecting] = useState(false)

  // Keys autorizadas
  const VALID_KEYS = ["AURA2", "MAJESTIC-PRO", "123456", "VIP-ACCESS"];

  const handleLogin = () => {
    if (VALID_KEYS.includes(key.trim().toUpperCase())) {
      setStage('loading')
      setTimeout(() => setStage('dashboard'), 1500)
    } else {
      alert("ID DE PARCEIRO NÃO LOCALIZADO.")
    }
  }

  const handleIA = () => {
    if (!phoneModel) return alert("Informe o modelo do aparelho")
    setIsGenerating(true)
    setTimeout(() => {
      const base = senseType === 'ALTA' ? 96 : 85
      setGeneratedSense({
        geral: base + Math.floor(Math.random() * 4),
        redDot: base + 2,
        mira2x: 98,
        dpi: os === 'android' ? '720' : 'Otimizada'
      })
      setIsGenerating(false)
    }, 1800)
  }

  const handleInject = () => {
    setIsInjecting(true)
    setLogs(["> Estabelecendo túnel seguro...", "> Aplicando correções de hardware..."])
    setTimeout(() => {
      setLogs(prev => [...prev, "> SUCESSO! Redirecionando..."])
      setTimeout(() => {
        window.location.href = os === 'android'
          ? 'intent://#Intent;package=com.dts.freefireth;scheme=android-app;end'
          : 'https://apps.apple.com/br/app/free-fire/id1300146617'
        setIsInjecting(false)
      }, 1000)
    }, 2500)
  }

  return (
    <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden select-none">
      <head>
        <title>Área do Parceiro</title>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#000000" />
      </head>

      <style jsx global>{`
        :root { --sat: env(safe-area-inset-top); }
        .safe-area { padding-top: var(--sat); }
      `}</style>

      {stage === 'login' && (
        <div className="flex flex-col h-full px-8 pt-24 animate-in fade-in duration-700">
          <div className="mb-12">
            <img src={ICON_LOJA} className="w-16 h-16 mb-6 opacity-80" alt="Logo" />
            <h1 className="text-3xl font-bold tracking-tighter">Portal do <br /><span className="text-[#820ad1]">Afiliado</span></h1>
            <p className="text-gray-500 text-sm mt-2 font-medium">Gestão de performance e acessos.</p>
          </div>

          <div className="space-y-4">
            <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">ID de Acesso</label>
              <input 
                type="text" value={key} onChange={(e) => setKey(e.target.value)}
                placeholder="Insira sua credencial" 
                className="w-full bg-[#111] border border-white/10 p-4 rounded-2xl outline-none focus:border-[#820ad1] transition-all"
              />
            </div>
            <button onClick={handleLogin} className="w-full bg-[#820ad1] py-4 rounded-2xl font-bold uppercase text-xs tracking-widest active:scale-95 transition-all">
              Acessar Painel
            </button>
          </div>
        </div>
      )}

      {stage === 'loading' && (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#820ad1]/20 border-t-[#820ad1]"></div>
        </div>
      )}

      {stage === 'dashboard' && (
        <div className="flex flex-col h-full safe-area overflow-y-auto px-6 pb-12 animate-in slide-in-from-bottom-4 duration-500">
          <div className="mt-8 mb-8 flex justify-between items-center">
            <h2 className="text-xl font-black uppercase tracking-tighter">Majestic <span className="text-[#820ad1]">VIP</span></h2>
            <div className="px-3 py-1 bg-[#111] rounded-full border border-white/10 text-[9px] font-bold text-[#820ad1]">ID: {key.slice(0,4)}***</div>
          </div>

          {/* GERADOR IA */}
          <div className="mb-6 rounded-3xl bg-[#0a0a0a] border border-white/5 p-5">
            <h3 className="text-[10px] font-black text-[#820ad1] mb-4 uppercase tracking-widest">IA SENSE GENERATOR</h3>
            <input 
              type="text" placeholder="Modelo do celular..." 
              value={phoneModel} onChange={(e) => setPhoneModel(e.target.value)}
              className="w-full bg-black border border-white/10 p-3 rounded-xl text-sm mb-4 outline-none focus:border-[#820ad1]"
            />
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={() => setSenseType('ALTA')} className={`py-2 rounded-xl text-[10px] font-bold transition-all ${senseType === 'ALTA' ? 'bg-[#820ad1] text-white' : 'bg-[#111] text-gray-500'}`}>SENSE ALTA</button>
              <button onClick={() => setSenseType('BAIXA')} className={`py-2 rounded-xl text-[10px] font-bold transition-all ${senseType === 'BAIXA' ? 'bg-[#820ad1] text-white' : 'bg-[#111] text-gray-500'}`}>SENSE BAIXA</button>
            </div>
            <button onClick={handleIA} disabled={isGenerating} className="w-full bg-white text-black font-black py-3 rounded-xl text-[10px] uppercase active:scale-95 transition-all">
              {isGenerating ? 'PROCESSANDO...' : 'GERAR SENSIBILIDADE'}
            </button>

            {generatedSense && (
              <div className="mt-5 grid grid-cols-2 gap-2 animate-in zoom-in-95">
                {Object.entries(generatedSense).map(([k, v]: any) => (
                  <div key={k} className="bg-black p-3 rounded-xl border border-white/5 text-center">
                    <div className="text-[8px] text-gray-500 uppercase mb-1">{k}</div>
                    <div className="text-sm font-black text-[#820ad1]">{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SELETOR OS */}
          <div className="mb-6 flex p-1 bg-[#111] rounded-xl border border-white/5">
            <button onClick={() => setOs('android')} className={`flex-1 py-2 rounded-lg text-[10px] font-bold ${os === 'android' ? 'bg-[#222] text-[#820ad1]' : 'text-gray-600'}`}>ANDROID</button>
            <button onClick={() => setOs('ios')} className={`flex-1 py-2 rounded-lg text-[10px] font-bold ${os === 'ios' ? 'bg-[#222] text-[#820ad1]' : 'text-gray-600'}`}>IOS (BRASIL)</button>
          </div>

          <button 
            onClick={handleInject} 
            disabled={isInjecting}
            className="w-full bg-[#820ad1] py-5 rounded-full font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#820ad1]/20 active:scale-95 transition-all"
          >
            {isInjecting ? 'INJETANDO...' : 'EXECUTAR NO JOGO'}
          </button>

          {logs.length > 0 && (
            <div className="mt-6 p-4 bg-black rounded-2xl border border-[#820ad1]/20 font-mono text-[9px] text-[#820ad1] space-y-1">
              {logs.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
