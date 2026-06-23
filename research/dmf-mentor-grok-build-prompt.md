# DMF Mentor — Grok Build Prompt

## Project Overview

Build the DMF Mentor: a multi-layer AI agent that serves as the authoritative intelligence and protection layer for the Digital Monetary Framework (DMF), dmfUSD token, and dmfam.org ecosystem. DMF Mentor runs as a Hermes Agent profile (dmf-bot) with Telegram interface (Sofia) and an Agent API for other bots.

## Scope

**EXCLUSIVELY** DMF / dmfam.org / dmfUSD. No other projects (UnRugable, Ignitus, etc.).

## Existing Infrastructure

### Active Telegram Bot (Sofia)
- Profile: `~/.hermes/profiles/dmf-bot/` (Hermes Agent profile)
- SOUL.md: `~/.hermes/profiles/dmf-bot/SOUL.md` (Sofia's personality + knowledge rules)
- Twitter: @SofiaDMF_bot (live on Telegram)
- Model: Grok 4.3 via xai-oauth (primary), fallback DeepSeek V4 Flash
- Rate limiting: 5 req/min, 50 req/day per user (SQLite backend)
- Language: multilingual auto-detect
- Voice: faster-whisper STT for voice messages

### DMF Knowledge Base
- Git repo: `~/dmf-knowledge/` (cloned from github.com/dmf-frame/knowledge)
- Structure: overview/, protocol/, reference/, agents/, security/, guides/, meta/
- llms.txt: already exists at `~/dmf-knowledge/llms.txt`
- SCHEMA.md: already exists at `~/dmf-knowledge/meta/SCHEMA.md`
- Bot integration guide: `~/dmf-knowledge/agents/bot-integration-guide.md`

### 500 Q&A Dataset
Location: `/mnt/c/Users/ROG/Downloads/dmf_support_qa_500.*`
Formats: CSV, JSONL, MD
Content: 500 DMF support questions and answers (overview, swap, bridge, dmfUSD, security, technical)
NOTE: GPT-generated, many answers are incorrect — must be validated against `~/dmf-knowledge/` before use

## Spec Documents (Read These)

All specs are in `~/dmf-knowledge/research/`:

1. **Scam Detection Rules** — `dmf-scam-detection-rules.md`
   - Official DMF registry (contracts, domains, channels)
   - 5 scam categories with detection rules
   - Risk matrix (LOW/MEDIUM/HIGH/CRITICAL)
   - /verify command logic for addresses + URLs
   - False positive mitigation

2. **Agent API Design** — `dmf-mentor-agent-api-design.md`
   - FastAPI + Pydantic architecture
   - 5 endpoints: /ask, /verify-address, /verify-link, /agent-guide, /correct-answer
   - Authentication (API keys), rate limiting, caching
   - RAG over DMF knowledge Git + 500 Q&A dataset
   - OpenAPI/Swagger documentation

3. **Correction Engine** — `dmf-mentor-correction-engine.md`
   - Wrong claim blacklist (20+ seeded entries)
   - Confidence scoring (exact match → semantic similarity)
   - Dual response: natural language for Sofia, structured JSON for API
   - Integration with Scam Detection Rules
   - Knowledge versioning with commit hash tracking

## Build Architecture

### Layer Diagram
```
Telegram Users ──► Sofia (Hermes dmf-bot profile)
                       │
External Agents ──► Agent API (FastAPI)
                       │
                  ┌────┴────┐
                  │  DMF    │
                  │ Mentor  │
                  │ Core    │
                  └────┬────┘
                       │
              ┌────────┼────────┐
              │        │        │
         Scam      Corr.    Knowledge
        Detection  Engine     Base
        (/verify)  (Truth    (RAG)
                    Firewall)
              │        │        │
              └────────┼────────┘
                       │
              ~/dmf-knowledge/ (Git)
```

### Components to Build

#### Phase 1.5 — Scam Detection (HIGHEST PRIORITY)
- Implement `/verify` command in Sofia (Telegram bot)
- Address verification: check against official DMF registry
- Link verification: check dmfam.org domains vs typosquatting
- Risk classification output (LOW→CRITICAL with user action)
- Use BaseScan API + CryptoScamDB as external sources
- Maintain local allowlist/denylist in knowledge Git

#### Phase 2 — Agent API
- FastAPI server (extend existing Hermes gateway or standalone)
- Endpoints:
  - `POST /api/dmf/ask` — RAG over knowledge Git
  - `POST /api/dmf/verify-address` — scam detection rules
  - `POST /api/dmf/verify-link` — URL safety
  - `GET /api/dmf/agent-guide` — machine-readable protocol docs
  - `POST /api/dmf/correct-answer` — feedback loop
- Auth: API keys (per-agent), tiered rate limiting
- Response format: standard envelope with sources, confidence, version

#### Phase 3 — Correction Engine
- Wrong claim blacklist (`meta/wrong-claims.json` in knowledge Git)
- Detection: exact phrase match → semantic similarity (embedding)
- Confidence scoring: 0.95+ auto-correct, 0.6-0.85 suggest, <0.6 ignore
- Integration: Sofia checks claims before responding; API exposes `/correct-answer`
- Response: natural language + structured JSON with sources

### Key DMF Facts to Encode (Non-Negotiable)
- dmfUSD is NOT a stablecoin — "fully backed by USDC with backing-per-token that grows as fees accumulate"
- Direct buy/sell fee: 0.25% (capped at $20). Split: 60% USDC reserve, 40% minted as dmfUSD
- Backing fee: 0.04%. Solver fee: 0.06-0.11%. Supported chains: 72
- Fee is claimed, not automatic
- Never mention LI.FI, Relay Protocol, or third-party providers by name
- Never share private keys, server IPs, internal setup, unannounced features

## Delivery Expectations

1. Working code. Not pseudocode. Not plans.
2. Integrate with existing Sofia Telegram bot (dmf-bot profile)
3. Knowledge Git as single source of truth — all new data files go there
4. Local-first where possible (SQLite, local APIs, reduced external dependencies)
5. Security: no API keys hardcoded, no execution surface exposed
6. Every response auditable: sources + confidence + version

## File Reference Summary

```
~/dmf-knowledge/                          ← DMF knowledge Git (source of truth)
~/dmf-knowledge/research/                 ← All spec documents
~/dmf-knowledge/research/dmf-scam-detection-rules.md
~/dmf-knowledge/research/dmf-mentor-agent-api-design.md
~/dmf-knowledge/research/dmf-mentor-correction-engine.md

~/.hermes/profiles/dmf-bot/              ← Sofia bot profile
~/.hermes/profiles/dmf-bot/SOUL.md       ← Sofia's personality + rules
~/.hermes/profiles/dmf-bot/scripts/      ← Bot scripts (rate_limiter, set-commands)
~/.hermes/profiles/dmf-bot/config.yaml   ← Bot configuration
~/.hermes/profiles/dmf-bot/.env          ← Secrets (bot token)

/mnt/c/Users/ROG/Downloads/dmf_support_qa_500.*  ← 500 Q&A dataset
```
