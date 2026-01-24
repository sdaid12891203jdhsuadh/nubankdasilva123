# 🔒 Sistema HWID Melhorado - Anti Falso Positivo

## 📋 Resumo das Mudanças

O sistema HWID foi completamente reestruturado para **evitar falsos positivos** quando usuários legítimos trocam de rede (WiFi ↔ 4G), mantendo a segurança contra compartilhamento de keys.

---

## ✅ O Que Foi Corrigido

### Problema Anterior:
- ❌ HWID incluía o IP na identificação
- ❌ Qualquer mudança de rede bloqueava imediatamente
- ❌ Usuários com WiFi + 4G em casa eram bloqueados
- ❌ Score muito baixo para bloqueio (70)

### Solução Implementada:
- ✅ HWID agora baseado em User-Agent + Accept-Language + Accept-Encoding
- ✅ IP separado do HWID (permite mudanças de rede)
- ✅ Sistema de score progressivo (0-100)
- ✅ Perdão automático após 24 horas
- ✅ Diferenciação entre mudanças normais e suspeitas

---

## 🎯 Como Funciona Agora

### 1. **Identificação de Dispositivo (HWID)**
```typescript
HWID = User-Agent + Accept-Language + Accept-Encoding
```
- Não inclui mais o IP
- Permite trocar de rede sem mudar HWID
- Identifica dispositivo único

### 2. **Sistema de Score Progressivo**

| Ação | Score Adicionado | Bloqueio |
|------|------------------|----------|
| Mudança de rede normal (> 30 min) | +5 | Não |
| Mudança de rede rápida (< 30 min) | +15 | Não |
| Mudança muito rápida (< 3 min) | +35 | Não* |
| Mais de 5 mudanças de IP | +30 extra | Sim |
| HWID diferente (outro dispositivo) | +60 | Sim** |
| Score ≥ 100 | - | **SIM** |

\* Apenas se score total ≥ 100  
\** Bloqueia na segunda tentativa

### 3. **Perdão Automático**
- A cada 24 horas sem atividade suspeita:
  - Score reduz em -20 pontos
  - Contador de mudanças reduz em -1

---

## 📊 Exemplos de Cenários

### ✅ Cenário 1: Usuário Normal com WiFi + 4G
```
08:00 - Login com WiFi casa (IP: 192.168.1.100)
       Score: 0 | Status: ✅ Permitido

12:00 - Sai de casa, usa 4G (IP: 200.100.50.25)
       Score: +5 (mudança normal) | Status: ✅ Permitido

18:00 - Volta pra casa, WiFi (IP: 192.168.1.100)
       Score: +5 (mudança normal) | Status: ✅ Permitido

Total: Score 10/100 - Completamente seguro
```

### ⚠️ Cenário 2: Atividade Suspeita Moderada
```
08:00 - Login IP A (Score: 0)
08:05 - Login IP B (Score: +35 - muito rápido)
08:10 - Login IP C (Score: +35 - muito rápido)
08:15 - Login IP D (Score: +35 - muito rápido)

Total: Score 105/100 - 🔴 BLOQUEADO
```

### 🚨 Cenário 3: Compartilhamento de Key
```
08:00 - Dispositivo A (HWID-1) - Login OK
08:30 - Dispositivo B (HWID-2) - 1ª tentativa bloqueada (+60)
09:00 - Dispositivo B (HWID-2) - 2ª tentativa (+60)

Total: Score 120/100 - 🔴 BLOQUEADO PERMANENTE
```

---

## 🔧 Configurações

As seguintes constantes podem ser ajustadas no arquivo `route.ts`:

```typescript
const BLOCK_SCORE = 100;              // Score para bloqueio
const FAST_IP_CHANGE_MS = 3 * 60 * 1000;    // 3 minutos
const NORMAL_IP_CHANGE_MS = 30 * 60 * 1000;  // 30 minutos
const LEAK_THRESHOLD = 5;             // Dispositivos diferentes
const MAX_IP_CHANGES = 5;             // Mudanças de IP permitidas
const SCORE_DECAY_MS = 24 * 60 * 60 * 1000; // 24 horas
```

---

## 📱 Notificações Discord

### 🟢 Login Normal
```
✅ Login bem-sucedido: KEY-XXX
- HWID: Chrome/120...
- IP: 192.168.1.100
- Score: 0/100
- Status: Acesso autorizado
```

### 🔵 Mudança de Rede (Permitida)
```
📱 Mudança de rede detectada: KEY-XXX
- IP Novo: 200.100.50.25
- Mudanças de IP: 2/5
- Score Atual: 15/100
- Razão: ✓ Troca de rede rápida (< 30 min)
- Status: ✅ Acesso permitido
```

### 🟡 Atividade Suspeita (Monitorada)
```
⚠️ Mudança de rede detectada: KEY-XXX
- IP Novo: 150.200.30.10
- Mudanças de IP: 5/5
- Score Atual: 65/100
- Razão: ⚠️ Troca de rede muito rápida (< 3 min)
- Status: ✅ Acesso permitido (monitorando)
```

### 🔴 Bloqueio Ativado
```
🚨 Key BLOQUEADA por atividade suspeita: KEY-XXX @everyone
- IP Novo: 100.50.25.10
- Total de IPs: 8
- Mudanças de IP: 8
- Score Final: 120/100
- Status: 🔴 BLOQUEADO
```

---

## 🛡️ Segurança Mantida

Mesmo com a flexibilidade, o sistema ainda protege contra:

1. **Compartilhamento de Key** - HWID diferente = bloqueio
2. **VPN Hopping** - Mudanças muito rápidas acumulam score
3. **Múltiplos Dispositivos** - Detecta quando passa de 5 dispositivos
4. **Atividade Agressiva** - Score sobe rapidamente com ações suspeitas

---

## 🎉 Resultado

- ✅ Usuários legítimos podem trocar entre WiFi e 4G livremente
- ✅ Falsos positivos drasticamente reduzidos
- ✅ Sistema inteligente aprende padrões normais
- ✅ Segurança contra compartilhamento mantida
- ✅ Notificações detalhadas no Discord

---

## 📝 Notas Importantes

1. O sistema guarda histórico em memória (Map). Para produção, considere usar banco de dados.
2. Score de 100 pode ser ajustado conforme necessário
3. Período de perdão (24h) pode ser alterado
4. Logs detalhados ajudam a identificar padrões
