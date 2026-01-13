import { NextResponse } from 'next/server'

/**
 * Controle simples em memória
 * key -> Set de fingerprints
 */
const keyUsage = new Map<string, Set<string>>()

function getWebhookUrl() {
  const b64 = process.env.DISCORD_WEBHOOK_B64
  if (!b64) throw new Error('WEBHOOK NÃO CONFIGURADA')
  return Buffer.from(b64, 'base64').toString('utf-8')
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { key, fingerprint } = body

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      req.headers.get('x-real-ip') ||
      'unknown'

    const userAgent = req.headers.get('user-agent') || 'unknown'

    // =========================
    // 🔎 CONTROLE DE KEY
    // =========================
    if (!keyUsage.has(key)) {
      keyUsage.set(key, new Set())
    }

    const fingerprints = keyUsage.get(key)!
    fingerprints.add(fingerprint)

    const accessCount = fingerprints.size
    const sharedDetected = accessCount > 1

    // =========================
    // 📡 WEBHOOK
    // =========================
    const webhookUrl = getWebhookUrl()

    const message: any = {
      content: sharedDetected ? '⚠️ **KEY COMPARTILHADA DETECTADA** @everyone' : null,
      embeds: [
        {
          title: sharedDetected ? '🚨 WARNING – KEY EM USO MÚLTIPLO' : '🔐 LOGIN COM KEY',
          color: sharedDetected ? 15158332 : 3447003,
          fields: [
            { name: 'Key', value: `\`${key}\`` },
            { name: 'Fingerprint', value: `\`${fingerprint}\`` },
            { name: 'Total de dispositivos', value: `\`${accessCount}\`` },
            { name: 'IP', value: `\`${ip}\`` },
            { name: 'User-Agent', value: userAgent }
          ],
          footer: {
            text: new Date().toLocaleString('pt-BR')
          }
        }
      ]
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    })

    return NextResponse.json({
      success: true,
      sharedDetected
    })
  } catch (err) {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    )
  }
}
