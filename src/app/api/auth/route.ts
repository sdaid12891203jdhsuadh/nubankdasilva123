import { NextResponse } from 'next/server';

// Configuração do Discord Webhook (encodado em base64 para segurança)
const discordWebhookBase64 = 'aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM5ODg0MzUwODUyNTI0MDQzMy9TeVc2NjAtLUpkWW9NNUxTSVlSXzIxQkVPanBudThyZ3pwMW42WmVBdXZlMWtRRmRhVkhkaFB5VzQ5Z2FqRHdGNGNRSA==';
const discordWebhookUrl = Buffer.from(discordWebhookBase64, 'base64').toString('utf-8');

// Configuração da Key
export type HWIDSession = {
  hwid: string;
  firstIp: string;
  firstSeen: number;
  lastSeen: number;
  ips: Set<string>;
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

const BLOCK_SCORE = 70; // Pontuação para bloqueio
const FAST_IP_CHANGE_MS = 5 * 60 * 1000; // Tolerância de troca rápida de IP (5 minutos)
const LEAK_THRESHOLD = 3; // Quantidade de usuários diferentes para alertar

/**
 * Função para obter o IP do cliente.
 */
function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for') || '';
  return xff.split(',')[0].trim() || 'unknown';
}

/**
 * Função para gerar o HWID (identificação única do dispositivo).
 */
function generateHWID(req: Request): string {
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const ip = getClientIp(req); // Usa o IP como parte do HWID para maior exatidão
  return `${userAgent}-${ip}`;
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
 */
async function trackKeyUsage(key: string, hwid: string, ip: string): Promise<number> {
  if (!keyUsageTracking.has(key)) {
    keyUsageTracking.set(key, []);
  }

  const usageList = keyUsageTracking.get(key)!;
  const now = Date.now();

  // Busca se esse usuário (HWID + IP) já acessou
  const existingUser = usageList.find((u) => u.hwid === hwid && u.ip === ip);

  if (existingUser) {
    // Atualiza último acesso do usuário existente
    existingUser.lastAccess = now;
  } else {
    // Novo usuário detectado
    usageList.push({
      hwid,
      ip,
      firstAccess: now,
      lastAccess: now,
    });

    // Se ultrapassar o limite de usuários diferentes
    if (usageList.length > LEAK_THRESHOLD) {
      await notifyDiscord(`🔴 VAZAMENTO DE CHAVE DETECTADO! **${key}**`, [
        { name: '👥 Usuários Diferentes', value: `\`${usageList.length}\`` },
        { name: '🚨 Novo HWID', value: `\`${hwid}\`` },
        { name: '📍 Novo IP', value: `\`${ip}\`` },
        { name: '⏰ Horário', value: new Date().toLocaleString('pt-BR') },
        { name: '📋 Detalhes', value: `Chave compartilhada entre ${usageList.length} dispositivos/IPs diferentes!` },
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
      keySessions.set(key, {
        hwid,
        firstIp: ip,
        firstSeen: now,
        lastSeen: now,
        ips: new Set([ip]),
      });

      await notifyDiscord(`🔓 Nova Key registrada: **${key}**`, [
        { name: 'HWID', value: `\`${hwid}\`` },
        { name: 'IP', value: `\`${ip}\`` },
        { name: 'Mensagem', value: 'Key vinculada com sucesso.' },
        { name: 'Horário', value: new Date().toLocaleString('pt-BR') },
      ]);

      return NextResponse.json({ success: true, message: 'Key registrada com sucesso!' });
    }

    const session = keySessions.get(key)!;

    // Verificação do HWID
    if (session.hwid !== hwid) {
      await notifyDiscord(`🚨 Tentativa de login com HWID diferente: **${key}**`, [
        { name: 'HWID Novo', value: `\`${hwid}\`` },
        { name: 'HWID Original', value: `\`${session.hwid}\`` },
        { name: 'IP', value: `\`${ip}\`` },
        { name: 'Usuários Diferentes Detectados', value: `\`${uniqueUsers}\`` },
        { name: 'Mensagem', value: 'Login bloqueado devido a HWID diferente.' },
      ]);
      return NextResponse.json(
        { success: false, message: 'Key vinculada a outro dispositivo. Acesso negado.' },
        { status: 403 }
      );
    }

    // Verificação de mudanças de IP
    if (!session.ips.has(ip)) {
      const fastIpChange = now - session.lastSeen < FAST_IP_CHANGE_MS;

      let score = fastIpChange ? 50 : 30; // Aumentar score para mudanças rápidas de IP
      const reasons = [`IP Novo Detectado: ${ip}`];
      if (fastIpChange) reasons.push('Troca de IP muito rápida detectada!');

      // Bloqueio por troca agressiva de IPs
      if (score >= BLOCK_SCORE) {
        await notifyDiscord(`🚨 Key compartilhada detectada: **${key}** @everyone`, [
          { name: 'IP Novo', value: `\`${ip}\`` },
          { name: 'IP Original', value: `\`${session.firstIp}\`` },
          { name: 'HWID', value: `\`${session.hwid}\`` },
          { name: 'Usuários Diferentes', value: `\`${uniqueUsers}\`` },
          { name: 'Mensagem', value: 'Key BLOQUEADA devido a compartilhamento.' },
          { name: 'Score de Risco', value: `\`${score}/100\`` },
        ]);
        return NextResponse.json({ success: false, message: 'A Key foi bloqueada: atividade suspeita.', blocked: true }, { status: 403 });
      }

      // Atualiza mudanças de sessões com um aviso
      session.ips.add(ip);
      session.lastSeen = now;

      await notifyDiscord(`⚠️ Tentativa de login com IP diferente: **${key}**`, [
        { name: 'IP Novo', value: `\`${ip}\`` },
        { name: 'IP Original', value: `\`${session.firstIp}\`` },
        { name: 'Usuários Diferentes Detectados', value: `\`${uniqueUsers}\`` },
        { name: 'Mensagem', value: 'Key ainda funcional, mas IP novo detectado.' },
      ]);
    } else {
      // Atualiza o último login
      session.lastSeen = now;

      // Log de acesso bem-sucedido com mesmo HWID e IP
      await notifyDiscord(`✅ Login bem-sucedido: **${key}**`, [
        { name: 'HWID', value: `\`${hwid}\`` },
        { name: 'IP', value: `\`${ip}\`` },
        { name: 'Usuários Diferentes Detectados', value: `\`${uniqueUsers}\`` },
        { name: 'Mensagem', value: 'Acesso autorizado.' },
        { name: 'Horário', value: new Date().toLocaleString('pt-BR') },
      ], 65280); // Verde (0x00FF00)
    }

    return NextResponse.json({ success: true, message: 'Autenticado com sucesso.' });
  } catch (error) {
    console.error('Erro no processamento da Key:', error);
    return NextResponse.json({ success: false, message: 'Erro interno no servidor.' }, { status: 500 });
  }
}
