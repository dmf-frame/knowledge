# DMF Mentor — Build Prompt for Grok Build

## Scope
Build DMF Mentor — an AI intelligence + protection layer for the Digital Monetary Framework (dmfam.org, dmfUSD token). EXCLUSIVELY DMF. No other projects.

## Read These Specs First
All at `~/dmf-knowledge/research/`:
- `dmf-scam-detection-rules.md` — /verify logic, risk matrix, official registry
- `dmf-mentor-agent-api-design.md` — FastAPI endpoints, auth, rate limits
- `dmf-mentor-correction-engine.md` — wrong claim blacklist, truth firewall

## What Exists Today
- **Sofia** — Telegram bot @SofiaDMF_bot, Hermes profile at `~/.hermes/profiles/dmf-bot/`
- **Knowledge Git** — `~/dmf-knowledge/` (llms.txt, SCHEMA.md, agents/bot-integration-guide.md present)
- **500 Q&A** — `/mnt/c/Users/ROG/Downloads/dmf_support_qa_500.*` (GPT-generated, needs validation)

## Build in This Order

### 1. /verify Command (Sofia Bot) — HIGHEST PRIORITY
Implement inside existing dmf-bot profile. Command: `/verify <address|domain|@handle>`
- Check addresses against official DMF registry (spec: Section 1)
- Risk levels: LOW / MEDIUM / HIGH / CRITICAL
- JSON output for future API + natural language for Telegram
- Use BaseScan API + CryptoScamDB as external verification sources
- Maintain local allowlist in knowledge Git

### 2. Agent API (FastAPI)
Five endpoints:
- `POST /api/dmf/ask` — RAG over DMF knowledge Git
- `POST /api/dmf/verify-address` — scam detection
- `POST /api/dmf/verify-link` — URL safety
- `GET /api/dmf/agent-guide` — machine-readable bootstrap
- `POST /api/dmf/correct-answer` — correction feedback loop

Stack: FastAPI + Pydantic v2. Auth: API keys. Response envelope with sources + confidence.

### 3. Correction Engine
- Wrong claim blacklist → `meta/wrong-claims.json` in knowledge Git
- Detection: exact phrase match → semantic similarity
- Seeded with 20+ claims from the spec (e.g., "dmfUSD is algorithmic stablecoin")
- Confidence: >0.95 auto-correct, 0.6-0.85 suggest, <0.6 ignore
- Dual output: natural + structured JSON

## Non-Negotiable DMF Facts
- dmfUSD is NOT a stablecoin → "fully backed by USDC, backing-per-token grows"
- 0.25% buy/sell fee (capped $20). Split: 60% USDC reserve, 40% minted
- Backing fee 0.04%, solver fee 0.06-0.11%, 72 chains
- NO oracle, NO liquidation, NO algorithmic mechanics
- Never mention LI.FI, Relay Protocol by name

## Rules
- All specs at `~/dmf-knowledge/research/` — read them before building
- Knowledge Git = single source of truth
- Local-first (SQLite, local APIs)
- No API keys hardcoded, no execution surface
- Every response auditable (sources + confidence + version)
- Working code, not pseudocode
