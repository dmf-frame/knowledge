# Tether Stack — Code Skeleton & QVAC RAG Research

**Date**: 2026-05-19  
**Source**: x.ai research + tetherto/qvac GitHub README v0.5.0 (May 11 2026)  
**Status**: Ready for implementation

---

## QVAC RAG Deep Dive (from tetherto/qvac README v0.5.0)

**What it is:**  
The `@qvac/rag` package is a dedicated JavaScript library for full Retrieval-Augmented Generation:
- Document ingestion (text → embeddings)
- Vector search (local vector DB)
- LLM integration (seamless with `@qvac/sdk` completions)

**Architecture:**
- Vector store → backed by Hyperdrive (P2P filesystem) → distributed/replicated across peers
- Embedding model → any QVAC on-device model (e.g., nomic-embed-text)
- P2P superpowers → models and vector indexes fetched from peers (delegated inference, blind relays)
- No cloud → 100% local (CPU/GPU/NPU via llama.cpp / Fabric backends)

**Flow:**
1. `loadModel(...)` for embedding model
2. `new RAG({ vectorStore: hyperdriveInstance, embeddingModel, llmModel })`
3. `rag.ingest(docs[])` — each doc = {id, content, metadata}
4. `rag.query(query, {k: 5})` — returns relevant chunks
5. Feed context into `completion(...)` from `@qvac/sdk`

**Status**: Production-ready for basic RAG. Hyperdrive integration built in. v0.5.0 — expect more addons via future bounties.

---

## Starter Code Skeleton

```js
// index.js — P2P dmfam-style USDT Yield App (Tether Stack Starter)
import { pear } from 'pear'
import Hypercore from 'hypercore'
import Hyperbee from 'hyperbee'
import Hyperdrive from 'hyperdrive'
import { loadModel, completion, unloadModel } from '@qvac/sdk'
import { RAG } from '@qvac/rag'
import { createWallet, getUSDTBalance } from '@tether/wdk'
import { getQuote, executeIntent } from '@relay/link/sdk'

// === 1. P2P Setup ===
const core = new Hypercore('yield-data')
const db = new Hyperbee(core, { keyEncoding: 'utf-8', valueEncoding: 'json' })
const drive = new Hyperdrive('models')

pear.on('exit', () => { core.close(); console.log('Shutdown clean') })
core.on('peer-open', (peer) => console.log('Peer joined:', peer.remotePublicKey.toString('hex')))

// === 2. Seed Yield Data ===
async function seedYieldData() {
  await db.put('positions/usdt-tron', { amount: 10000, apy: 8.5, lastUpdated: Date.now() })
  await db.put('history/2026-05-01', { action: 'deposit', usdt: 5000, chain: 'tron' })
}

// === 3. QVAC RAG ===
async function setupQVAC_RAG() {
  const embedId = await loadModel({
    modelSrc: 'nomic-embed-text-v1.5-q4',
    modelType: 'embedding',
    onProgress: (p) => console.log(Math.round(p * 100) + '%')
  })
  const rag = new RAG({
    vectorStore: await drive.get('vectors/yield-index'),
    embeddingModel: embedId,
    llmModel: 'llama-3.2-1b-inst-q4'
  })
  const docs = await db.createReadStream({ gt: 'history/' }).collect()
  await rag.ingest(docs.map(d => ({ id: d.key, content: `USDT ${d.value.action} on ${d.value.chain}: ${d.value.usdt}`, metadata: d.value })))
  return rag
}

// === 4. WDK Wallet ===
async function initWallet() {
  const wallet = await createWallet({ chains: ['tron', 'ethereum', 'ton'] })
  return wallet
}

// === 5. Relay Swap ===
async function swapUSDT(wallet, amount) {
  const quote = await getQuote({ fromChain: 'tron', toChain: 'ethereum', fromToken: 'USDT', toToken: 'USDT', amount, fromAddress: wallet.address })
  return await executeIntent(quote, { wallet })
}

async function main() {
  await seedYieldData()
  const wallet = await initWallet()
  const rag = await setupQVAC_RAG()
  console.log('App ready — try rag.query() or swapUSDT()')
  process.on('SIGINT', () => pear.exit())
}
main().catch(console.error)
```

**How to run:**
1. `curl -fsSL https://get.pears.com | sh`
2. `pear init my-dmfam-p2p` → Desktop or Mobile (Expo)
3. `npm install @qvac/sdk @qvac/rag hyperbee hypercore hyperdrive`
4. Paste code into `index.js`
5. `pear run`

---

## Live Bounties Map (tether.dev)

| Bounty | Reward (USDT) | Maps To |
|--------|------|---------|
| WDK Module | 1.5k–4k | Wallet integration |
| WDK Template Wallet | 2k–4k | UI skeleton |
| Browser Extension Starter | 3k | P2P wallet ext |
| QVAC Swift Client | 5k–10k | Mobile QVAC |
| QVAC CoreML Acceleration | 5k–10k | Apple hardware AI |
| QVAC Video Gen Addon | 3k–8k | Multi-modal |
| Pears Tutorial/docs | 1k–3k | App documentation |

Apply at https://tether.dev/grants/apply-for-a-grant/
