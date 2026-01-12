'use client'

import { useState, useEffect } from 'react'

export default function PainelVip() {
  const [stage, setStage] = useState<'login' | 'app'>('login')
  const [key, setKey] = useState('')
  const [device, setDevice] = useState<'android' | 'ios'>('ios')
  const [intensity, setIntensity] = useState<'ALTA' | 'BAIXA'>('ALTA')
  const [phoneModel, setPhoneModel] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [senseData, setSenseData] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [isCalibrating, setIsCalibrating] = useState(false)

  const handleLogin = () => {
    if (key.trim() !== "") setStage('app')
  }

  const generateSense = () => {
    if (!phoneModel) return alert("Digite o modelo do aparelho")
    setIsGenerating(true)
    setTimeout(() => {
      const base = intensity === 'ALTA' ? 92 : 82
      setSenseData({
        geral: base + Math.floor(Math.random() * 5),
        redDot: base + 3,
        mira2x: 95 + Math.floor(Math.random() * 4),
        mira4x: 98,
        dpi: device === 'android' ? '580 a 720' : 'Padrão iOS'
      })
      setIsGenerating(false)
    }, 1500)
  }

  const startCalibration = () => {
    setIsCalibrating(true)
    setLogs([])
    const steps = [
      "> Analisando taxa de atualização da tela...",
      "> Otimizando touch response (MS)...",
      "> Deletando arquivos temporários (Cache)...",
      "> Calibrando zona morta do analógico...",
      "> Ajustando estabilidade da mira (No-Overhead)...",
      "> Sincronização de Hardware concluída!"
    ]
    
    steps.forEach((step, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step])
        if (i === steps.length - 1) setIsCalibrating(false)
      }, i * 800)
    })
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <head>
        <title>Portal de Acessos</title>
      </head>

      {stage === 'login' ? (
        <div className="flex flex-col pt-20">
          <h1 className="text-3xl font-bold mb-2">Portal <span className="text-[#820ad1]">Majestic</span></h1>
          <p className="text-gray-500 text-sm mb-10">Insira sua credencial de acesso VIP.</p>
          <input 
            type="password" value={key} onChange={(e) => setKey(e.target.value)}
            className="w-full bg-[#111] border border-white/10 p-4 rounded-2xl mb-4 outline-none focus:border-[#820ad1]"
            placeholder="Chave de Acesso"
          />
          <button onClick={handleLogin} className="w-full bg-[#820ad1] py-4 rounded-2xl font-bold uppercase text-xs">Entrar</button>
        </div>
      ) : (
        <div className="fade-in">
          <header className="flex justify-between items-center mb-8">
            <h2 className="font-black text-xl italic uppercase tracking-tighter text-[#820ad1]">Majestic VIP</h2>
            <div className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-gray-400">STATUS: ATIVO</div>
          </header>

          {/* GERADOR DE SENSE */}
          <section className="bg-[#111] border border-white/5 rounded-3xl p-5 mb-6">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-4 tracking-widest">Calibração de Sensibilidade</h3>
            
            <input 
              type="text" placeholder="Modelo do Celular (Ex: iPhone 13)"
              className="w-full bg-black border border-white/5 p-4 rounded-xl text-sm mb-4 outline-none focus:border-[#820ad1]"
              value={phoneModel} onChange={(e) => setPhoneModel(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2 mb-2">
              <button onClick={() => setDevice('android')} className={`py-3 rounded-xl text-[10px] font-bold border ${device === 'android' ? 'bg-[#820ad1] border-[#820ad1]' : 'border-white/5 text-gray-600'}`}>ANDROID</button>
              <button onClick={() => setDevice('ios')} className={`py-3 rounded-xl text-[10px] font-bold border ${device === 'ios' ? 'bg-[#820ad1] border-[#820ad1]' : 'border-white/5 text-gray-600'}`}>IOS (BR)</button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={() => setIntensity('ALTA')} className={`py-3 rounded-xl text-[10px] font-bold border ${intensity === 'ALTA' ? 'border-[#820ad1] text-[#820ad1]' : 'border-white/5 text-gray-600'}`}>SENSE ALTA</button>
              <button onClick={() => setIntensity('BAIXA')} className={`py-3 rounded-xl text-[10px] font-bold border ${intensity === 'BAIXA' ? 'border-[#820ad1] text-[#820ad1]' : 'border-white/5 text-gray-600'}`}>SENSE BAIXA</button>
            </div>

            <button onClick={generateSense} disabled={isGenerating} className="w-full bg-white text-black font-black py-4 rounded-xl text-[11px] uppercase">
              {isGenerating ? 'ANALISANDO HARDWARE...' : 'GERAR CONFIGURAÇÃO'}
            </button>

            {senseData && (
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                  <p className="text-[8px] text-gray-500 uppercase">Geral</p>
                  <p className="text-lg font-bold text-[#820ad1]">{senseData.geral}</p>
                </div>
                <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                  <p className="text-[8px] text-gray-500 uppercase">DPI Recomendada</p>
                  <p className="text-lg font-bold text-[#820ad1]">{senseData.dpi}</p>
                </div>
              </div>
            )}
          </section>

          {/* OTIMIZAÇÃO TÉCNICA */}
          <button onClick={startCalibration} disabled={isCalibrating} className="w-full border border-[#820ad1] text-[#820ad1] py-5 rounded-full font-black text-[11px] uppercase tracking-widest active:bg-[#820ad1] active:text-white transition-all">
            {isCalibrating ? 'CALIBRANDO...' : 'OTIMIZAR TELA & CACHE'}
          </button>

          {logs.length > 0 && (
            <div className="mt-6 p-4 bg-[#0a0a0a] rounded-2xl border border-white/5 font-mono text-[9px] text-gray-400 space-y-2">
              {logs.map((log, i) => <div key={i} className="animate-in fade-in slide-in-from-left-2">{log}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
