'use client'
import { useEffect, useState } from 'react'
import { deviceDetector } from '../utils/deviceDetector'
import { haptics } from '../utils/haptics'

export default function DeviceAnalysis({ setView }: any) {
  const [progress, setProgress] = useState(0)
  const [currentCheck, setCurrentCheck] = useState('')
  const [deviceInfo, setDeviceInfo] = useState<any>(null)
  const [performanceScore, setPerformanceScore] = useState(0)

  useEffect(() => {
    const runAnalysis = async () => {
      const checks = [
        { text: 'Detectando especificações...', duration: 800 },
        { text: 'Analisando hardware...', duration: 1000 },
        { text: 'Verificando compatibilidade...', duration: 700 },
        { text: 'Testando performance...', duration: 900 },
        { text: 'Otimizando configurações...', duration: 600 },
      ]

      for (let i = 0; i < checks.length; i++) {
        setCurrentCheck(checks[i].text)
        haptics.light()
        
        await new Promise(resolve => setTimeout(resolve, checks[i].duration))
        setProgress(((i + 1) / checks.length) * 100)

        // Coleta info real no meio do processo
        if (i === 1) {
          const info = deviceDetector.getDeviceInfo()
          setDeviceInfo(info)
        }

        if (i === 3) {
          const score = deviceDetector.measurePerformance()
          setPerformanceScore(score)
        }
      }

      haptics.success()
      setTimeout(() => setView('os'), 1000)
    }

    runAnalysis()
  }, [])

  const recommended = deviceInfo ? deviceDetector.getRecommendedSettings() : null

  return (
    <div className="fixed inset-0 bg-[#070707] flex flex-col items-center justify-center p-8 z-30 animate-in fade-in duration-500">
      <div className="w-full max-w-md">
        {/* Título */}
        <h2 className="text-white text-center text-2xl font-black mb-2 uppercase tracking-wider animate-in slide-in-from-top duration-500">
          Análise do Sistema
        </h2>
        <p className="text-zinc-500 text-center text-xs mb-8 animate-in slide-in-from-top duration-500 delay-100">
          Detectando hardware para otimização
        </p>

        {/* Círculo de Progress */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="#1a1a1a"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="#820AD1"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              className="transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-white">{Math.round(progress)}%</span>
            <span className="text-xs text-zinc-500 mt-1">Analisando</span>
          </div>
        </div>

        {/* Status Atual */}
        <div className="bg-[#0f0f0f] border border-zinc-900 rounded-2xl p-4 mb-6 animate-in fade-in duration-500 delay-200">
          <p className="text-zinc-400 text-sm text-center font-medium animate-pulse">
            {currentCheck}
          </p>
        </div>

        {/* Info do Dispositivo */}
        {deviceInfo && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom duration-500 delay-300">
            <div className="bg-[#0f0f0f] border border-zinc-900 rounded-xl p-3 hover:border-[#820AD1]/50 transition-all hover:shadow-[0_0_15px_rgba(130,10,209,0.2)]">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs">RAM Detectada</span>
                <span className="text-white font-bold text-sm">{deviceInfo.memory}GB</span>
              </div>
            </div>

            <div className="bg-[#0f0f0f] border border-zinc-900 rounded-xl p-3 hover:border-[#820AD1]/50 transition-all hover:shadow-[0_0_15px_rgba(130,10,209,0.2)]">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs">Resolução</span>
                <span className="text-white font-bold text-sm">
                  {deviceInfo.width}x{deviceInfo.height}
                </span>
              </div>
            </div>

            {performanceScore > 0 && (
              <div className="bg-[#0f0f0f] border border-zinc-900 rounded-xl p-3 hover:border-[#820AD1]/50 transition-all hover:shadow-[0_0_15px_rgba(130,10,209,0.2)]">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-xs">Performance Score</span>
                  <span 
                    className="font-bold text-sm"
                    style={{ 
                      color: performanceScore >= 70 ? '#00ff00' : 
                             performanceScore >= 50 ? '#ffaa00' : '#ff5555' 
                    }}
                  >
                    {performanceScore}/100
                  </span>
                </div>
              </div>
            )}

            {recommended && progress === 100 && (
              <div 
                className="border rounded-xl p-4 animate-in fade-in zoom-in duration-500 hover:shadow-[0_0_20px_rgba(130,10,209,0.3)] transition-all"
                style={{ 
                  borderColor: recommended.color,
                  backgroundColor: `${recommended.color}15`
                }}
              >
                <p className="font-black text-sm mb-1" style={{ color: recommended.color }}>
                  {recommended.label}
                </p>
                <p className="text-xs text-zinc-400">{recommended.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Loading Spinner */}
        {progress < 100 && (
          <div className="flex justify-center mt-6">
            <div className="w-2 h-2 bg-[#820AD1] rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-[#820AD1] rounded-full animate-ping ml-2" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-[#820AD1] rounded-full animate-ping ml-2" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>
    </div>
  )
}
