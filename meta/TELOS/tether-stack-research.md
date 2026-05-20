# TELOS: Tether Open-Source Stack — Future Build Research

**Date**: 2026-05-19  
**Source**: x.ai deep research via user (verified against official docs as of May 12, 2026)  
**Status**: Research complete — ready for planning

---

## What Changed From Prior Understanding

| Before | Corrected |
|--------|-----------|
| QVAC = quantum-resistant + AI verification | QVAC = Local/P2P AI SDK (LLMs, STT, embeddings, RAG on-device) |
| Pears = "serverless P2P framework" | Confirmed — Hypercore/Hyperbee/Hyperdrive, `pear://` links, Bare runtime |
| WDK = wallet kit | Confirmed — active bounties for modules |
| Tether stack = early/beta | Confirmed — but more mature: PearPass live, QVAC 117 releases, 168 stars, 57 contributors |

---

## The Stack

```
Your App (P2P dmfam-like USDT product)
├── Pears (serverless P2P frontend + data sync)
│   ├── Hypercore (append-only logs)
│   ├── Hyperbee (shared key-value DB)
│   ├── Hyperdrive (P2P filesystem)
│   └── Hyperswarm + HyperDHT (peer discovery)
├── QVAC (local AI — LLMs, STT, embeddings, RAG entirely on-device)
│   ├── @qvac/sdk (npm package)
│   ├── P2P model sharing + inference delegation
│   └── No cloud APIs needed (private by default)
├── WDK_tether (custom multi-chain USDT wallet)
│   ├── @tether.me usernames
│   ├── Auto gas-in-USDT deduction
│   └── Active bounties for new modules
└── Relay.link (embedded multi-chain swaps, 85+ chains)
```

---

## Key Implications

- **Pears** replaces all backend infra (no AWS, Vercel, Railway) — zero infra cost
- **QVAC** gives local AI — on-device yield forecasting, personalized advice, RAG over on-chain data. Private, no API fees
- **WDK** gives native USDT wallet with @usernames and auto gas
- **Relay.link** handles cross-chain movement
- Everything open-source under `tetherto/` GitHub org
- Tether pays via grants/bounties at https://tether.dev/grants/apply-for-a-grant/

---

## Edge Over dmfUSD

QVAC gives this stack AI baked into the protocol layer — something dmfUSD doesn't have:
- On-device yield predictions
- Local RAG over own transaction history
- P2P model sharing for community analytics

---

## Gemini Correction

QVAC was initially misunderstood as quantum-resistant cryptography. Corrected by x.ai research: it's a local/P2P AI SDK. The "Q" refers to decentralized "quantum-scale" intelligence vision, not post-quantum crypto. Official docs never mention quantum-resistant signatures.
