'use client'

import { useState, useMemo } from 'react'

export default function SkinDisfarceAimPanel() {
  const [step, setStep] = useState<'login' | 'os' | 'panel'>('login')
  const [password, setPassword] = useState('')
  const [os, setOs] = useState<'android' | 'ios'>('android')
  const [isInjecting, setIsInjecting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showMiniPanel, setShowMiniPanel] = useState(false)
  const [logs, setLogs] = useState(['> DATABASE: SKINS_V14_READY', '> STATUS: WAITING_AUTH'])

  // Configurações Reais do Aim Assist (Disfarçadas no nome)
  const [aimValue, setAimValue] = useState(15) // Sensibilidade do Aim
  const [fovValue, setFovValue] = useState(30) // Campo de visão do Aim
  const [opts, setOpts] = useState({
    noRecoil: true, // "Otimizar Texturas"
    espLine: false, // "Linhas de Guia"
    aimSmooth: true // "Suavizar Movimento"
  })

  const VALID_KEYS = useMemo(() => [
    "ACESSO-FREE", "NUBANK-MOD", "123456", "MAJESTIC-PRO", "CLISHA-091", 
    "NU-FAST-01", "NU-FAST-02", "NU-FAST-03", "MAJ-PRO-X1", "MAJ-PRO-X2", 
    "MAJ-PRO-X3", "SAFE-INJ-77", "SAFE-INJ-88", "SAFE-INJ-99", "VIP-BLOCK-0", 
    "VIP-BLOCK-1", "VIP-BLOCK-2", "GOLD-NU-55", "SILVER-NU-44", "SHIELD-99", 
    "SHIELD-88", "BZ-33-MOD", "BZ-44-MOD", "ACCESS-FULL", "MAJ-WEEK-01", 
    "MAJ-WEEK-02", "MAJ-WEEK-03", "VIP-SENSE-10", "VIP-SENSE-20", "PRO-FLOW-77", 
    "PRO-FLOW-88", "SHIELD-XP-01", "SHIELD-XP-02", "SHIELD-XP-03", "ACCESS-PREMIUM", 
    "ULTRA-V1-MOD", "ULTRA-V2-MOD", "ALPHA-SHIELD-1", "ALPHA-SHIELD-2", 
    "BETA-FLOW-X", "DELTA-VIP-99", "ZETA-PRO-55", "SIGMA-MOD-44", "FAST-TRACK-07", 
    "FAST-TRACK-08", "GLOBAL-ACCESS-1", "GLOBAL-ACCESS-2", "ELITE-XP-500", 
    "ELITE-XP-600", "MASTER-INJ-01", "MASTER-INJ-02", "FORCE-MOD-X", 
    "TITAN-PRO-V9", "LEGEND-FAST-0"
  ], []);

  const handleLogin = () => {
    if (VALID_KEYS.includes(password.trim().toUpperCase())) {
      setStep('os')
    } else {
      alert('KEY INVÁLIDA!')
      setPassword('')
    }
  }

  const handleInject = () => {
    setIsInjecting(true)
    setProgress(0)
    
    const steps = [
      { m: "> Localizando arquivos de sistema...", p: 25 },
      { m: "> Injetando valores Aim_Assist...", p: 50 },
      { m: "> Aplicando Bypass Anti-Cheat...", p: 80 },
      { m: "> MOD ATIVO COM SUCESSO!", p: 100 }
    ]

    steps.forEach((s, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, s.m])
        setProgress(s.p)
        if (i === steps.length - 1) {
          setShowMiniPanel(true)
          setIsInjecting(false)
          setTimeout(() => {
            const url = os === 'android' 
              ? "https://play.google.com/store/apps/details?id=com.dts.freefireth"
              : "https://apps.apple.com/br/app/free-fire/id1300146617"
            window.open(url, '_blank')
          }, 1000)
        }
      }, (i + 1) * 900)
    })
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-zinc-100 font-sans overflow-hidden select-none">
      
      {/* MINI PAINEL DE STATUS */}
      {showMiniPanel && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-40 bg-black/90 border border-[#e11d48] rounded-2xl p-3 z-50 shadow-[0_0_20px_rgba(225,29,72,0.4)] animate-in slide-in-from-top-10">
          <p className="text-[8px] font-black text-[#e11d48] uppercase italic text-center mb-2 underline">System Active</p>
          <div className="flex justify-between text-[7px] font-bold uppercase mb-1">
            <span>Aim Assist</span> <span className="text-green-500 font-black">ON</span>
          </div>
          <div className="flex justify-between text-[7px] font-bold uppercase">
            <span>Bypass</span> <span className="text-green-500 font-black">ACTIVE</span>
          </div>
        </div>
      )}

      {step === 'login' ? (
        <div className="flex flex-col h-full items-center justify-center p-8 animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-[#e11d48]/10 rounded-3xl border border-[#e11d48]/30 flex items-center justify-center mb-8 rotate-12 shadow-[0_0_40px_rgba(225,29,72,0.1)]">
             <span className="text-4xl font-black text-[#e11d48] -rotate-12 italic">S</span>
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Skin <span className="text-[#e11d48]">Injector</span></h1>
          <p className="text-[9px] text-zinc-600 uppercase tracking-[0.4em] mb-12">Texture & Performance v4.0</p>
          
          <input 
            type="text" placeholder="DIGITE SUA CHAVE VIP" 
            className="w-full bg-[#111] border border-white/5 p-5 rounded-2xl mb-4 outline-none focus:border-[#e11d48]/50 text-center font-bold tracking-widest text-sm"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full bg-[#e11d48] text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-[#e11d48]/20">Acessar Sistema</button>
        </div>
      ) : step === 'os' ? (
        <div className="flex flex-col h-full justify-center px-8 animate-in slide-in-from-bottom-10">
          <h2 className="text-[10px] font-black mb-10 text-center uppercase tracking-[0.5em] text-zinc-500">Configurar Arquitetura</h2>
          <button onClick={() => { setOs('android'); setStep('panel') }} className="w-full bg-[#111] border border-white/5 p-7 rounded-3xl mb-4 flex justify-between items-center active:scale-95 transition-all">
            <span className="font-black italic uppercase tracking-widest">Android Core</span>
            <div className="w-8 h-8 rounded-full bg-[#e11d48]/10 flex items-center justify-center text-[#e11d48]">→</div>
          </button>
          <button onClick={() => { setOs('ios'); setStep('panel') }} className="w-full bg-[#111] border border-white/5 p-7 rounded-3xl flex justify-between items-center active:scale-95 transition-all">
            <span className="font-black italic uppercase tracking-widest">iOS Brasil</span>
            <div className="w-8 h-8 rounded-full bg-[#e11d48]/10 flex items-center justify-center text-[#e11d48]">→</div>
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full pt-14 px-8 animate-in fade-in">
          <header className="flex justify-between items-center mb-10">
            <div className="text-xs font-black italic uppercase text-zinc-400">Aim <span className="text-[#e11d48]">Configuration</span></div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </header>

          <div className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 mb-6 space-y-6">
            {/* AIM ASSIST SLIDER */}
            <div>
              <div className="flex justify-between mb-4">
                <span className="text-[10px] font-black uppercase text-zinc-500">Aim Assist Level</span>
                <span className="text-[#e11d48] font-bold text-xs">{aimValue}%</span>
              </div>
              <input type="range" min="0" max="100" value={aimValue} onChange={(e) => setAimValue(parseInt(e.target.value))} className="w-full h-1 bg-zinc-800 appearance-none accent-[#e11d48] rounded-full" />
            </div>

            {/* FOV SLIDER */}
            <div>
              <div className="flex justify-between mb-4">
                <span className="text-[10px] font-black uppercase text-zinc-500">Fov Calibration</span>
                <span className="text-[#e11d48] font-bold text-xs">{fovValue}°</span>
              </div>
              <input type="range" min="0" max="180" value={fovValue} onChange={(e) => setFovValue(parseInt(e.target.value))} className="w-full h-1 bg-zinc-800 appearance-none accent-[#e11d48] rounded-full" />
            </div>

            <div className="h-px bg-white/5" />

            {/* CHECKBOXES DE SUPORTE */}
            <div className="space-y-4">
              {[
                { id: 'noRecoil', label: 'Anti-Shake (No Recoil)' },
                { id: 'aimSmooth', label: 'Soft Tracking (Smooth)' }
              ].map(item => (
                <label key={item.id} className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={(opts as any)[item.id]} onChange={() => setOpts({...opts, [item.id]: !(opts as any)[item.id]})} className="hidden" />
                  <div className={`w-4 h-4 rounded border transition-all ${(opts as any)[item.id] ? 'bg-[#e11d48] border-[#e11d48]' : 'border-zinc-700 bg-black'}`}>
                    {(opts as any)[item.id] && <div className="text-white text-[8px] text-center mt-0.5">✓</div>}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${(opts as any)[item.id] ? 'text-zinc-100' : 'text-zinc-600'}`}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            onClick={handleInject} 
            disabled={isInjecting}
            className="w-full bg-[#e11d48] text-white font-black py-5 rounded-3xl uppercase text-[11px] tracking-[0.3em] shadow-xl shadow-red-900/20 active:scale-95 transition-all mb-6 relative overflow-hidden"
          >
            <span className="relative z-10">{isInjecting ? 'INJETANDO...' : 'EXECUTAR INJEÇÃO'}</span>
            {isInjecting && (
              <div className="absolute inset-0 bg-white/10 transition-all duration-500" style={{ width: `${progress}%` }} />
            )}
          </button>

          <div className="bg-black/50 p-4 rounded-2xl border border-white/5 font-mono text-[8px] text-zinc-600 space-y-1 h-24 overflow-y-auto">
            {logs.map((log, i) => <div key={i}>{log}</div>)}
          </div>
        </div>
      )}
    </div>
  )
}
