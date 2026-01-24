import { NextResponse } from 'next/server';

// Configuração do Discord Webhook (encodado em base64 para segurança)
const discordWebhookBase64 = 'aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM5ODg0MzUwODUyNTI0MDQzMy9TeVc2NjAtLUpkWW9NNUxTSVlSXzIxQkVPanBudThyZ3pwMW42WmVBdXZlMWtRRmRhVkhkaFB5VzQ5Z2FqRHdGNGNRSA==';
const discordWebhookUrl = Buffer.from(discordWebhookBase64, 'base64').toString('utf-8');

// Tipo para armazenar informações de localização de IP
type IpLocation = {
  ip: string;
  city: string;
  region: string;
  country: string;
  firstSeen: number;
  lastSeen: number;
};

// Configuração da Key
export type HWIDSession = {
  hwid: string;
  firstIp: string;
  firstSeen: number;
  lastSeen: number;
  ips: Set<string>;
  ipLocations: Map<string, IpLocation>; // Histórico de localizações
  ipChanges: number; // Contador de mudanças de IP
  suspiciousScore: number; // Score de atividade suspeita
  lastIpChangeTime: number; // Timestamp da última mudança de IP
};

// Tipo para rastrear usuários únicos por chave
type UserAccess = {
  hwid: string;
  ip: string;
  firstAccess: number;
  lastAccess: number;
};

const keySessions = new Map<string, HWIDSession>();
const keyUsageTracking = new Map<string, UserAccess[]>();

const BLOCK_SCORE = 100; // Pontuação para bloqueio definitivo
const FAST_IP_CHANGE_MS = 3 * 60 * 1000; // Mudanças rápidas de IP (3 minutos)
const NORMAL_IP_CHANGE_MS = 30 * 60 * 1000; // Mudanças normais de IP (30 minutos)
const LEAK_THRESHOLD = 5; // Quantidade de usuários diferentes para alertar
const MAX_IP_CHANGES = 5; // Máximo de mudanças de IP permitidas
const SCORE_DECAY_MS = 24 * 60 * 60 * 1000; // Tempo para reduzir score (24 horas)

/**
 * Função para obter o IP do cliente.
 */
function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for') || '';
  return xff.split(',')[0].trim() || 'unknown';
}

/**
 * Função para gerar o HWID (identificação única do dispositivo).
 * HWID agora é baseado apenas no User-Agent, sem incluir IP.
 */
function generateHWID(req: Request): string {
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const acceptLanguage = req.headers.get('accept-language') || '';
  const acceptEncoding = req.headers.get('accept-encoding') || '';
  
  // Cria um identificador baseado em características do navegador/dispositivo
  // mas SEM incluir o IP, permitindo mudanças de rede
  return `${userAgent}-${acceptLanguage}-${acceptEncoding}`;
}

/**
 * Função para buscar a localização de um IP usando API gratuita.
 */
async function getIpLocation(ip: string): Promise<{ city: string; region: string; country: string }> {
  if (ip === 'unknown' || ip === '127.0.0.1' || ip === 'localhost') {
    return { city: 'Desconhecido', region: 'Desconhecido', country: 'Desconhecido' };
  }

  try {
    // Usa ip-api.com (gratuito, sem necessidade de chave)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      return { city: 'Não disponível', region: 'Não disponível', country: 'Não disponível' };
    }

    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        city: data.city || 'Desconhecido',
        region: data.regionName || 'Desconhecido',
        country: data.country || 'Desconhecido',
      };
    }

    return { city: 'Não disponível', region: 'Não disponível', country: 'Não disponível' };
  } catch (error) {
    console.error('Erro ao buscar localização do IP:', error);
    return { city: 'Erro', region: 'Erro', country: 'Erro' };
  }
}

/**
 * Função para enviar alertas ao Discord Webhook.
 */
async function notifyDiscord(content: string, fields: Record<string, string>[], color: number = 15158332) {
  try {
    const response = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        embeds: [
          {
            title: '⚠️ Alertas de Segurança',
            color,
            fields,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error(`Discord Webhook Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Erro:', errorText);
    }
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
  }
}

/**
 * Função para rastrear usuários únicos e detectar vazamento de chave.
 * Agora considera apenas HWID diferentes, não IP.
 */
async function trackKeyUsage(key: string, hwid: string, ip: string): Promise<number> {
  if (!keyUsageTracking.has(key)) {
    keyUsageTracking.set(key, []);
  }

  const usageList = keyUsageTracking.get(key)!;
  const now = Date.now();

  // Busca se esse HWID já acessou (ignorando IP)
  const existingUser = usageList.find((u) => u.hwid === hwid);

  if (existingUser) {
    // Atualiza último acesso do usuário existente
    existingUser.lastAccess = now;
    existingUser.ip = ip; // Atualiza o IP atual
  } else {
    // Novo HWID detectado (dispositivo diferente)
    usageList.push({
      hwid,
      ip,
      firstAccess: now,
      lastAccess: now,
    });

    // Se ultrapassar o limite de HWIDs diferentes
    if (usageList.length > LEAK_THRESHOLD) {
      await notifyDiscord(`🔴 VAZAMENTO DE CHAVE DETECTADO! **${key}**`, [
        { name: '👥 Dispositivos Diferentes', value: `\`${usageList.length}\`` },
        { name: '🚨 Novo HWID', value: `\`${hwid.substring(0, 50)}...\`` },
        { name: '📍 IP Atual', value: `\`${ip}\`` },
        { name: '⏰ Horário', value: new Date().toLocaleString('pt-BR') },
        { name: '📋 Detalhes', value: `Chave compartilhada entre ${usageList.length} dispositivos diferentes!` },
      ], 16711680); // Vermelho (0xFF0000)
    }
  }

  return usageList.length;
}

/**
 * Endpoint principal: POST (Autenticação e Proteção da Key)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { key } = body;
    const hwid = generateHWID(req);
    const ip = getClientIp(req);
    const now = Date.now();

    if (!key) {
      return NextResponse.json({ success: false, message: 'Erro: Key ausente' }, { status: 400 });
    }

    // Rastreia uso da chave (detecta vazamentos)
    const uniqueUsers = await trackKeyUsage(key, hwid, ip);

    // Processamento de uma nova Key
    if (!keySessions.has(key)) {
      // Busca localização do primeiro IP
      const location = await getIpLocation(ip);
      
      const ipLocations = new Map<string, IpLocation>();
      ipLocations.set(ip, {
        ip,
        city: location.city,
        region: location.region,
        country: location.country,
        firstSeen: now,
        lastSeen: now,
      });

      keySessions.set(key, {
        hwid,
        firstIp: ip,
        firstSeen: now,
        lastSeen: now,
        ips: new Set([ip]),
        ipLocations,
        ipChanges: 0,
        suspiciousScore: 0,
        lastIpChangeTime: now,
      });

      await notifyDiscord(`🔓 Nova Key registrada: **${key}**`, [
        { name: 'HWID', value: `\`${hwid.substring(0, 50)}...\`` },
        { name: '📍 IP', value: `\`${ip}\`` },
        { name: '🌍 Localização', value: `\`${location.city}, ${location.region} - ${location.country}\`` },
        { name: 'Mensagem', value: 'Key vinculada com sucesso.' },
        { name: 'Horário', value: new Date().toLocaleString('pt-BR') },
      ]);

      return NextResponse.json({ success: true, message: 'Key registrada com sucesso!' });
    }

    const session = keySessions.get(key)!;

    // Redução de score ao longo do tempo (perdão por comportamento anterior)
    const timeSinceLastChange = now - session.lastIpChangeTime;
    if (timeSinceLastChange > SCORE_DECAY_MS) {
      session.suspiciousScore = Math.max(0, session.suspiciousScore - 20);
      session.ipChanges = Math.max(0, session.ipChanges - 1);
    }

    // Verificação do HWID (dispositivo diferente)
    if (session.hwid !== hwid) {
      // Aumenta score drasticamente para HWID diferente
      session.suspiciousScore += 60;
      
      // Busca localização do IP atual
      const currentLocation = await getIpLocation(ip);
      
      // Cria lista de IPs registrados com localização
      const ipsList = Array.from(session.ipLocations.values())
        .map((loc, index) => `${index + 1}. \`${loc.ip}\` - ${loc.city}, ${loc.country}`)
        .join('\n');
      
      await notifyDiscord(`🚨 Tentativa de login com HWID diferente: **${key}**`, [
        { name: 'HWID Novo', value: `\`${hwid.substring(0, 50)}...\`` },
        { name: 'HWID Original', value: `\`${session.hwid.substring(0, 50)}...\`` },
        { name: '📍 IP Atual', value: `\`${ip}\`` },
        { name: '🌍 Localização Atual', value: `\`${currentLocation.city}, ${currentLocation.region} - ${currentLocation.country}\`` },
        { name: '📋 IPs Registrados Nesta Key', value: ipsList || 'Nenhum' },
        { name: 'Dispositivos Diferentes', value: `\`${uniqueUsers}\`` },
        { name: 'Score Suspeito', value: `\`${session.suspiciousScore}/100\`` },
        { name: 'Mensagem', value: session.suspiciousScore >= BLOCK_SCORE ? '🔴 BLOQUEADO' : '⚠️ Monitorando' },
      ]);
      
      if (session.suspiciousScore >= BLOCK_SCORE) {
        return NextResponse.json(
          { success: false, message: 'Key vinculada a outro dispositivo. Acesso negado.', blocked: true },
          { status: 403 }
        );
      }
      
      // Permite primeira tentativa mas avisa
      return NextResponse.json(
        { success: false, message: 'Dispositivo não reconhecido. Entre em contato com o suporte.' },
        { status: 403 }
      );
    }

    // Verificação de mudanças de IP (permite trocas de rede WiFi/4G)
    if (!session.ips.has(ip)) {
      const timeSinceLastIpChange = now - session.lastIpChangeTime;
      const isVeryFastChange = timeSinceLastIpChange < FAST_IP_CHANGE_MS;
      const isFastChange = timeSinceLastIpChange < NORMAL_IP_CHANGE_MS;
      
      // Busca localização do novo IP
      const newLocation = await getIpLocation(ip);
      
      // Incrementa contador de mudanças de IP
      session.ipChanges++;
      session.lastIpChangeTime = now;
      
      // Calcula score baseado no padrão de mudanças
      let changeScore = 0;
      let changeReason = '';
      
      if (isVeryFastChange) {
        changeScore = 35; // Mudança muito rápida é mais suspeita
        changeReason = '⚠️ Troca de rede muito rápida (< 3 min)';
      } else if (isFastChange) {
        changeScore = 15; // Mudança rápida moderada
        changeReason = '✓ Troca de rede rápida (< 30 min)';
      } else {
        changeScore = 5; // Mudança normal (pode ser WiFi -> 4G ao sair de casa)
        changeReason = '✓ Troca de rede normal';
      }
      
      // Aumenta score se houver muitas mudanças
      if (session.ipChanges > MAX_IP_CHANGES) {
        changeScore += 30;
        changeReason += ' | Muitas mudanças detectadas';
      }
      
      session.suspiciousScore += changeScore;
      
      // Verifica se deve bloquear
      if (session.suspiciousScore >= BLOCK_SCORE) {
        // Cria lista de todos os IPs com localização
        const ipsList = Array.from(session.ipLocations.values())
          .map((loc, index) => `${index + 1}. \`${loc.ip}\` - ${loc.city}, ${loc.country}`)
          .join('\n');

        await notifyDiscord(`🚨 Key BLOQUEADA por atividade suspeita: **${key}** @everyone`, [
          { name: '🆕 IP Novo', value: `\`${ip}\`` },
          { name: '🌍 Localização Nova', value: `\`${newLocation.city}, ${newLocation.region} - ${newLocation.country}\`` },
          { name: 'IP Original', value: `\`${session.firstIp}\`` },
          { name: '📋 Todos os IPs Registrados', value: ipsList + `\n**→ ${session.ips.size + 1}. \`${ip}\` - ${newLocation.city}, ${newLocation.country}** ⚠️ NOVO` },
          { name: 'Total de IPs', value: `\`${session.ips.size + 1}\`` },
          { name: 'Mudanças de IP', value: `\`${session.ipChanges}\`` },
          { name: 'Score Final', value: `\`${session.suspiciousScore}/100\`` },
          { name: 'Dispositivos Diferentes', value: `\`${uniqueUsers}\`` },
          { name: 'Razão', value: changeReason },
          { name: 'Status', value: '🔴 BLOQUEADO' },
        ], 16711680); // Vermelho
        
        return NextResponse.json({ 
          success: false, 
          message: 'Key bloqueada por atividade suspeita. Entre em contato com o suporte.', 
          blocked: true 
        }, { status: 403 });
      }
      
      // Adiciona o novo IP com localização ao histórico
      session.ips.add(ip);
      session.ipLocations.set(ip, {
        ip,
        city: newLocation.city,
        region: newLocation.region,
        country: newLocation.country,
        firstSeen: now,
        lastSeen: now,
      });
      session.lastSeen = now;
      
      // Cria lista de todos os IPs com destaque no atual
      const ipsList = Array.from(session.ipLocations.values())
        .map((loc, index) => {
          const isCurrentIp = loc.ip === ip;
          return isCurrentIp 
            ? `**→ ${index + 1}. \`${loc.ip}\` - ${loc.city}, ${loc.country}** ⚡ ATUAL`
            : `${index + 1}. \`${loc.ip}\` - ${loc.city}, ${loc.country}`;
        })
        .join('\n');
      
      // Notifica mudança de IP (mas permite acesso)
      const emoji = session.suspiciousScore > 50 ? '⚠️' : '📱';
      const color = session.suspiciousScore > 50 ? 16776960 : 3447003; // Amarelo ou Azul
      
      await notifyDiscord(`${emoji} Mudança de rede detectada: **${key}**`, [
        { name: '🆕 IP Novo', value: `\`${ip}\`` },
        { name: '🌍 Localização Nova', value: `\`${newLocation.city}, ${newLocation.region} - ${newLocation.country}\`` },
        { name: 'IP Original', value: `\`${session.firstIp}\`` },
        { name: '📋 Histórico de IPs Desta Key', value: ipsList },
        { name: 'Total de IPs', value: `\`${session.ips.size}\`` },
        { name: 'Mudanças de IP', value: `\`${session.ipChanges}/${MAX_IP_CHANGES}\`` },
        { name: 'Score Atual', value: `\`${session.suspiciousScore}/100\`` },
        { name: 'Razão', value: changeReason },
        { name: 'Status', value: '✅ Acesso permitido' },
      ], color);
      
    } else {
      // Mesmo IP, atualiza apenas o timestamp
      session.lastSeen = now;
      
      // Atualiza também o lastSeen na localização
      const existingLocation = session.ipLocations.get(ip);
      if (existingLocation) {
        existingLocation.lastSeen = now;
      }
    }

    return NextResponse.json({ success: true, message: 'Autenticado com sucesso.' });
  } catch (error) {
    console.error('Erro no processamento da Key:', error);
    return NextResponse.json({ success: false, message: 'Erro interno no servidor.' }, { status: 500 });
  }
}
