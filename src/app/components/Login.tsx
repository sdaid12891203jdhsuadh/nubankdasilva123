'use client'

const NUBANK_LOGO = "https://logodownload.org/wp-content/uploads/2019/08/nubank-logo-2.png"

export default function Login({ password, setPassword, handleLogin }: any) {
  return (
    <div className="fixed inset-0 bg-[#070707] flex flex-col p-8 z-30">
      <div className="mt-12 mb-12">
        <img src={NUBANK_LOGO} className="w-12" alt="Nu" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Olá, VIP</h1>
      <input 
        type="text" 
        placeholder="CHAVE DE ACESSO" 
        className="w-full bg-transparent border-b border-zinc-800 p-4 text-white outline-none uppercase" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button 
        onClick={handleLogin} 
        className="w-full bg-[#820AD1] text-white font-bold py-4 rounded-full mt-10 uppercase text-xs"
      >
        AUTENTICAR
      </button>
    </div>
  )
}
