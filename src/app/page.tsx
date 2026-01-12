<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Loja de Roupas - Parceiros</title>
    
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Roupas">
    <meta name="theme-color" content="#000000">
    
    <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/3050/3050222.png">
    <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/3050/3050222.png">

    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #000; color: #fff; font-family: 'Inter', sans-serif; }
        :root { --sat: env(safe-area-inset-top); }
        .safe-top { padding-top: var(--sat); }
        .nu-purple { background-color: #820ad1; }
        .text-purple { color: #820ad1; }
        input[type="range"] { accent-color: #820ad1; }
        .hidden { display: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-in { animation: fadeIn 0.5s ease-in-out; }
    </style>
</head>
<body class="fixed inset-0 overflow-hidden select-none">

    <div id="stage-login" class="flex flex-col h-full px-8 pt-24 pb-12 fade-in">
        <div class="mb-10">
            <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20.37 4.91l-3.37-2.1a2 2 0 0 0-2.11 0l-9.76 5.9A2 2 0 0 0 4 10.38V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5.63a1 1 0 0 0-.63-.72z"/><path d="M12 21V7"/></svg>
            </div>
            <h1 class="text-3xl font-bold tracking-tighter">Área do <br><span class="text-purple">Afiliado</span></h1>
            <p class="text-gray-400 text-sm mt-2">Acesse seu painel de performance e vendas.</p>
        </div>

        <div class="space-y-4">
            <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">ID de Acesso</label>
                <input type="text" id="key-input" placeholder="Digite sua KEY de parceiro" 
                    class="w-full bg-[#111] border border-white/10 p-4 rounded-xl outline-none focus:border-purple transition-all text-white">
            </div>
            <button onclick="handleLogin()" class="w-full nu-purple py-4 rounded-xl font-bold uppercase text-xs tracking-widest active:scale-95 transition-all shadow-lg shadow-purple/20">
                Entrar no Painel
            </button>
        </div>

        <div class="mt-auto text-center">
            <p class="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Premium Partner Program © 2024</p>
        </div>
    </div>

    <div id="stage-loading" class="hidden h-full flex flex-col items-center justify-center fade-in">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-purple/20 border-t-purple"></div>
        <p class="mt-4 text-[10px] font-bold tracking-[0.3em] text-purple">SINCRONIZANDO...</p>
    </div>

    <div id="stage-app" class="hidden flex flex-col h-full safe-top overflow-y-auto px-6 pb-12 fade-in">
        <div class="mt-8 mb-8 flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-black tracking-tighter uppercase">Majestic <span class="text-purple">VIP</span></h2>
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Injetor Ativo</span>
                </div>
            </div>
            <div class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-[#111]">
                <span class="text-[10px] font-bold">V1.2</span>
            </div>
        </div>

        <div class="mb-6 rounded-3xl border border-white/5 bg-[#111] p-6 shadow-2xl">
            <div class="flex items-center gap-2 mb-6">
                <div class="w-1 h-4 nu-purple rounded-full"></div>
                <h3 class="text-[11px] font-black uppercase tracking-widest">IA Sense Generator</h3>
            </div>
            
            <input type="text" id="phone-model" placeholder="Ex: iPhone 13 Pro Max" 
                class="w-full bg-black border border-white/5 p-4 rounded-2xl text-sm mb-4 outline-none focus:border-purple/50">
            
            <div class="grid grid-cols-2 gap-2 mb-4">
                <button onclick="setSenseType('ALTA')" id="btn-alta" class="py-3 rounded-xl text-[10px] font-bold border border-purple nu-purple">SENSE ALTA</button>
                <button onclick="setSenseType('BAIXA')" id="btn-baixa" class="py-3 rounded-xl text-[10px] font-bold border border-white/5 text-gray-500">SENSE BAIXA</button>
            </div>
            
            <button onclick="generateSense()" id="btn-gen" class="w-full bg-white text-black font-black py-4 rounded-2xl text-[11px] uppercase active:scale-95 transition-all">
                Gerar Melhor Sensibilidade
            </button>

            <div id="sense-result" class="hidden mt-6 grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95">
                </div>
        </div>

        <div class="mb-6 grid grid-cols-2 gap-2 p-1 bg-[#111] rounded-2xl border border-white/5">
            <button onclick="setOS('android')" id="os-android" class="py-3 rounded-xl text-[10px] font-bold text-gray-500">ANDROID</button>
            <button onclick="setOS('ios')" id="os-ios" class="py-3 rounded-xl text-[10px] font-bold bg-[#222] text-purple">IOS (BRASIL)</button>
        </div>

        <div class="mb-8 rounded-3xl border border-white/5 bg-[#111] overflow-hidden">
            <div class="flex items-center justify-between p-5 border-b border-white/5">
                <span class="text-sm font-bold">Auto-Aim Headshot</span>
                <input type="checkbox" checked class="w-5 h-5">
            </div>
            <div class="flex items-center justify-between p-5 border-b border-white/5">
                <span class="text-sm font-bold">Bypass Anti-Cheat</span>
                <input type="checkbox" checked class="w-5 h-5">
            </div>
            <div class="flex items-center justify-between p-5">
                <span class="text-sm font-bold">Ultra FPS Boost</span>
                <input type="checkbox" class="w-5 h-5">
            </div>
        </div>

        <button onclick="handleInject()" id="btn-inject" class="w-full nu-purple py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-purple/30 active:scale-95 transition-all">
            Injetar no Free Fire
        </button>

        <div id="logs" class="hidden mt-6 p-4 bg-black rounded-2xl border border-purple/20 font-mono text-[10px] text-purple space-y-2"></div>
    </div>

    <script>
        let currentOS = 'ios';
        let currentSenseType = 'ALTA';
        // Coloque aqui suas Keys válidas
        const VALID_KEYS = ["AURA2", "MAJESTIC-PRO", "123456", "VIP-ACCESS"];

        function handleLogin() {
            const val = document.getElementById('key-input').value.trim().toUpperCase();
            if(!VALID_KEYS.includes(val)) return alert("ID DE AFILIADO NÃO ENCONTRADO!");

            document.getElementById('stage-login').classList.add('hidden');
            document.getElementById('stage-loading').classList.remove('hidden');

            setTimeout(() => {
                document.getElementById('stage-loading').classList.add('hidden');
                document.getElementById('stage-app').classList.remove('hidden');
            }, 2000);
        }

        function setSenseType(type) {
            currentSenseType = type;
            document.getElementById('btn-alta').className = type === 'ALTA' ? 'py-3 rounded-xl text-[10px] font-bold border border-purple nu-purple' : 'py-3 rounded-xl text-[10px] font-bold border border-white/5 text-gray-500';
            document.getElementById('btn-baixa').className = type === 'BAIXA' ? 'py-3 rounded-xl text-[10px] font-bold border border-purple nu-purple' : 'py-3 rounded-xl text-[10px] font-bold border border-white/5 text-gray-500';
        }

        function setOS(os) {
            currentOS = os;
            document.getElementById('os-android').className = os === 'android' ? 'py-3 rounded-xl text-[10px] font-bold bg-[#222] text-purple' : 'py-3 rounded-xl text-[10px] font-bold text-gray-500';
            document.getElementById('os-ios').className = os === 'ios' ? 'py-3 rounded-xl text-[10px] font-bold bg-[#222] text-purple' : 'py-3 rounded-xl text-[10px] font-bold text-gray-500';
        }

        function generateSense() {
            const model = document.getElementById('phone-model').value;
            if(!model) return alert("Digite o modelo do aparelho!");
            
            const btn = document.getElementById('btn-gen');
            btn.innerText = "IA ANALISANDO HARDWARE...";
            btn.disabled = true;

            setTimeout(() => {
                const base = currentSenseType === 'ALTA' ? 95 : 84;
                const res = document.getElementById('sense-result');
                res.innerHTML = `
                    <div class="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
                        <div class="text-[8px] text-gray-500 uppercase font-bold mb-1">GERAL</div>
                        <div class="text-xl font-black text-purple">${base + Math.floor(Math.random()*4)}</div>
                    </div>
                    <div class="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
                        <div class="text-[8px] text-gray-500 uppercase font-bold mb-1">DPI</div>
                        <div class="text-xl font-black text-purple">${currentOS === 'android' ? '720' : 'OFF'}</div>
                    </div>
                `;
                res.classList.remove('hidden');
                btn.innerText = "GERAR MELHOR SENSIBILIDADE";
                btn.disabled = false;
            }, 2000);
        }

        function handleInject() {
            const btn = document.getElementById('btn-inject');
            const logs = document.getElementById('logs');
            btn.innerText = "EXECUTANDO BYPASS...";
            btn.disabled = true;
            logs.classList.remove('hidden');
            logs.innerHTML = '<div>> Iniciando conexão segura...</div>';

            setTimeout(() => {
                logs.innerHTML += '<div class="text-green-500">> SUCESSO! Abrindo Free Fire...</div>';
                setTimeout(() => {
                    window.location.href = currentOS === 'android' 
                        ? 'intent://#Intent;package=com.dts.freefireth;scheme=android-app;end'
                        : 'https://apps.apple.com/br/app/free-fire/id1300146617';
                    btn.innerText = "INJETAR NO FREE FIRE";
                    btn.disabled = false;
                }, 1500);
            }, 2500);
        }
    </script>
</body>
</html>
