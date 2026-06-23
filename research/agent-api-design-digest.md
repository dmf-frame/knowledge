# Agent API Design Research Digest

## Research Date
2026-06-22

## Scope
How DMF Mentor should expose a **bot-facing API** so other agents/bots (Sofia, future agents) can consume DMF knowledge programmatically instead of natural language chat.

## 1. FastAPI vs MCP vs Express

**Recommendation: FastAPI (Python) as primary, MCP as secondary adapter.**

- **FastAPI**: Best for DMF stack. Async, Pydantic v2 validation, automatic OpenAPI, high performance (Starlette/Uvicorn). Python ecosystem matches existing DMF tooling (Foundry scripts, knowledge base in Python-friendly format). Lightweight enough for MVP.
- **MCP (Model Context Protocol)**: Emerging standard (Anthropic). JSON-RPC style for agent-to-tool. Excellent for Claude/Cursor-style clients. Should be supported as an **adapter layer** on top of the same backend (not the only interface). Use FastAPI for core, MCP server wrapper for agent-native clients.
- **Express (Node.js)**: Overkill and wrong language. No Pydantic equivalent, weaker type safety. Only if existing JS bot infra — not applicable here.

**Tradeoff**: FastAPI wins on dev speed + validation. Add MCP later for ecosystem fit.

## 2. Auth Patterns for Bot-to-Bot

**Recommendation: API keys (HMAC-signed) + optional rate-limit tier. Avoid OAuth for pure bot-to-bot.**

- **API Keys**: Simplest, stateless, per-bot identity. Store hashed keys in DB/Redis. Include `X-API-Key` header + optional timestamp + HMAC signature for replay protection.
- **OAuth 2.0 / Client Credentials**: Good when bots act on behalf of users or need scoped delegation. Heavy for internal bot swarm.
- **Open + Rate Limit**: Acceptable for public read-only endpoints (e.g. /agent-guide). Use IP + key for abuse protection.
- **Hybrid**: Public endpoints (no key) with aggressive rate limits; privileged endpoints (/correct-answer, /verify-address) require key.

Store keys per "bot client" (e.g. Sofia, future agents) with metadata (owner, allowed endpoints).

## 3. Endpoint Design

Proposed REST endpoints (v1 prefix):

- `POST /v1/ask` — Main query endpoint. Body: `{query: string, context?: object, bot_id?: string}`. Returns structured answer + sources.
- `POST /v1/verify-address` — `{chain, address_or_name}` → on-chain verification result + contract metadata.
- `POST /v1/verify-link` — Verify Telegram/Discord/URL claims against knowledge base.
- `GET  /v1/agent-guide` — Returns full structured guide for agents (JSON version of bot-integration-guide.md).
- `POST /v1/correct-answer` — Submit correction/feedback from bot (requires auth). Used for knowledge improvement loop.

All endpoints accept JSON, return JSON. Use consistent envelope.

## 4. Response Format: JSON Schema Best Practices

**Always use Pydantic models + response_model=...** in FastAPI.

Standard envelope:
```json
{
  "status": "ok" | "error",
  "data": { ... },
  "error": { "code": "...", "message": "..." } | null,
  "meta": {
    "version": "2026-06-22",
    "sources": ["meta/SCHEMA.md", "agents/bot-integration-guide.md"],
    "cached": false,
    "model": "grok-4.3"
  }
}
```

- Every response declares its JSON Schema version.
- Use `additionalProperties: false` in schemas.
- Include `sources` array for auditability.
- For machine consumers: prefer flat + typed fields over nested prose.
- Error codes: machine-readable (e.g. RATE_LIMITED, INVALID_ADDRESS, KNOWLEDGE_NOT_FOUND).

## 5. Rate Limiting Strategies

**Per bot client (API key) primary, per-user secondary.**

- Use `slowapi` or Redis-based limiter (limits.py or custom).
- Default tiers:
  - Free/public: 10 req/min per IP
  - Registered bot (key): 300 req/min + burst
  - Premium bots: higher + priority queue
- Per-user: Only if the bot reports `user_id` in request (for multi-user bots like Sofia). Key-level limit is the hard cap.
- Headers: `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`.

Track usage per key in Redis with sliding window.

## 6. Caching Common Answers

**Redis + semantic cache for Grok call reduction.**

- Exact match cache (query hash → response) for top 100 frequent questions.
- Semantic cache: embed query, retrieve similar cached answer if cosine > 0.92.
- TTL: 24h for static knowledge, 5min for live on-chain data (/verify-address).
- Invalidation: on knowledge base update (git hook or manual).
- Cache key includes `bot_id` + query normalized.
- Saves ~60-80% of Grok calls on repeated mentor questions.

Use `redis-py` + `sentence-transformers` for embeddings if needed.

## 7. OpenAPI/Swagger Docs for Bot APIs

**FastAPI auto-generates perfect docs at /docs and /openapi.json.**

- Use `description` and `examples` heavily in Pydantic models and endpoint decorators.
- Tag endpoints clearly (`ask`, `verify`, `guide`).
- Provide `examples` in responses for every endpoint.
- Generate client SDK stubs automatically (or use `openapi-generator` for TypeScript/Python clients).
- Host static `/v1/openapi.json` for bot discovery.
- Add `x-bot-intent` extension in schema for agent planners.

MCP tools can be auto-generated from the same OpenAPI spec.

## 8. Simplest MVP: One Working Endpoint

**MVP scope (1-2 days work):**

1. FastAPI app with single endpoint: `POST /v1/ask`
2. API key auth via header (hardcoded 2-3 dev keys initially)
3. Pydantic request/response models
4. Basic Redis rate limit (100 req/min per key)
5. Stub implementation: load from `dmf-knowledge/` markdown + simple keyword match or call Grok once
6. Response always includes `meta.sources`
7. Auto OpenAPI at `/docs`
8. Deploy behind nginx or directly (uvicorn)

Later add: MCP adapter, caching layer, /verify-* endpoints, correction loop.

This gives a working bot-facing API immediately while the rest of DMF Mentor (correction engine, knowledge sync) is built.

## Next Steps for DMF Mentor
- Start with FastAPI + Pydantic + Redis.
- Expose /v1/ask first.
- Treat MCP as a parallel interface (same backend).
- Every endpoint must be schema-strict and source-citable.

This design makes DMF Mentor the canonical machine interface for DMF knowledge.