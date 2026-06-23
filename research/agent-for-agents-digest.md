# Agent-for-Agents Protocol Research Digest

## Research Date
2026-06-22

## What It Is

Agent-for-Agents Protocols are systems where **AI agents, bots, and automated software systems** serve as the primary consumers of information and services—rather than humans. For DMF Mentor, this means building an API/service that teaches **OTHER bots** how to use DMF correctly, not just human users.

The core insight: Sofia (Telegram bot) already answers DMF questions in natural language. DMF Mentor needs to provide the **same answers** but in **structured, machine-parseable formats** that other bots can consume programmatically.

---

## How It Works

Instead of natural language responses, the DMF Mentor returns:

1. **Schema-validated JSON** responses (not prose)
2. **On-chain verifiable data** where possible (contract calls, not static docs)
3. **Versioned, citable sources** (every answer includes doc references)
4. **Intent-based queries** (not just text search—bots ask "what is the fee?" and get a structured object)

The knowledge base (`~/dmf-knowledge/`) is the same source of truth, but consumed via API rather than chat.

**Emerging standard**: MCP (Model Context Protocol) from Anthropic is becoming the de facto standard for agent-to-tool/agent communication.

---

## Key Capabilities Required

| # | Capability | Why It Matters |
|---|-----------|---------------|
| 1 | **Machine-readable responses** (JSON Schema) | Bots can't parse prose reliably |
| 2 | **Schema-validated responses** | No ambiguity, no hallucination |
| 3 | **Versioned knowledge base** | Frontmatter in `meta/SCHEMA.md` already does this |
| 4 | **Queryable by intent** | "get_fees" → structured object, not text search |
| 5 | **Verifiable on-chain data** | Contract calls for live facts (backing ratio, totalSupply) |
| 6 | **Bot-specific rate limiting** | Bots need 10-100x the throughput of humans |

---

## Existing Projects & References

### DMF Knowledge Base (Existing Asset)
- Has `llms.txt` — plain text URL index for LLM crawlers
- Has `meta/SCHEMA.md` — frontmatter spec for all docs
- Has `agents/bot-integration-guide.md` — existing bot guidance
- Has `agents/CLAUDE.md` and `agents/ai-assistant-guide.md` — agent instructions
- **Strong foundation** — just needs an API layer on top

### Chainlink
- **Best-in-class** `llms.txt` with clear navigation and machine-readable structure
- Serves as the reference for how DeFi protocols should document for AI agents

### Uniswap
- Has `llms-full.txt` but harder to navigate
- Content is good but index is weak

### Aave / 1inch / Major DeFi
- Aave: No `llms.txt` found (404 on `aave.com/.well-known/llms.txt`)
- 1inch: 301 redirect, not functional
- **First-mover opportunity** for DMF

### MCP (Model Context Protocol)
- Anthropic's standard for agent-to-tool communication
- JSON-RPC based, servers expose `tools` and `resources`
- Used by Claude, Cursor, and growing ecosystem
- **Recommended as the primary interface** for DMF Mentor

### AutoGPT / CrewAI / LangGraph
- Multi-agent frameworks for intra-agent collaboration
- Not directly relevant for bot-to-bot knowledge sharing
- More about agent orchestration than knowledge distribution

---

## API Patterns for Bot Clients

| Pattern | Best For | Recommendation |
|---------|----------|---------------|
| **MCP (Model Context Protocol)** | AI agent clients (Claude, Cursor, etc.) | **Primary** — emerging standard |
| **REST + JSON Schema** | Simple bots, monitoring scripts, Telegram bots | **Secondary** — simple, universal |
| **GraphQL** | Complex relational data | Over-engineered for DMF |
| **WebSocket** | Real-time data (prices, monitoring) | Not needed for static knowledge |
| **llms.txt + Markdown** | LLM crawlers/ingestion | Already done |

### Recommended API Endpoints (REST)
```
GET  /v1/topic/{topic_id}       → JSON Schema response
POST /v1/query                  → Intent-based structured query
GET  /v1/verify/{claim}         → On-chain verification of a claim
GET  /v1/address/{chain}/{name} → Contract address lookup
GET  /v1/fee/{operation}        → Fee structure for buy/refund/etc.
GET  /v1/backing_ratio          → Live on-chain backing ratio
```

### Recommended MCP Tools
```
get_protocol_info(topic)
get_contract_address(chain, name)
买卖合同,get_fees(operation)
get_backing_ratio()              → queries contract live
verify_invariant(invariant_id)     → checks on-chain
get_schema_for_topic(topic)       → returns JSON Schema
```

---

## Verification Systems for Machine-Parseable Responses

### 1. JSON Schema Validation
- Define all response schemas in `meta/SCHEMA.md`
- Every API response must validate against its schema
- Return `400` with validation errors if a bot sends an malformed request

### 2. Structured JSON Response Format
```json
{
  "topic": "fee-mechanism",
  "confidence": "verified",
  "sources": ["protocol/fee-me tunedup.md"],
  "answer": {
    "total_fee_bps": 25,
    "backing_bps": 15,
    "ops_bps": 10,
    "cap_usd": 20
  },
  "on_chain_data": {
    "contract": "0x624624FD3821d5F4f8f799369727f08d8219ce58",
    "block_number": 12345678,
    "timestamp": "2026-06-22T14:00:00Z"
  }
}
```

### 3. On-Chain Verification Layer
- For any claim that can be verified on-chain (backing ratio, totalSupply), the API should **call the contract directly**
- Response includes BOTH the on-chain value AND the doc reference
- Example: `totalAssets()` returns live USDC balance, not cached value

### 4. Knowledge Hash / Caching
- Include a content hash in every response so bots can cache and detect99detect when docs have updated
- `?if-none-match=<hash>` pattern for conditional requests

---

## Rate Limiting & Auth for Bot-Facing APIs

### Authentication Patterns
- **API Keys**: Required for all bot clients
- **OAuth2 Client Credentials**: For MCP clients (machine-to-machine)
- **No Auth**: For public read-only endpoints (addresses, static docs)

### Rate Limiting
- **Separate pools**: Bot rate limits ≠ human rate limits
- **Bot tiers**:
  - Read-Only: 1000 req/min (no cost, cached data)
  - Standard: 5000 req/min (standard caching)
  - Premium: 10000 req/min (real-time on-chain data)

### Bot Headers
```
X-Client-Type:XR bot
X-Bot-Version: 1.0.0
X-Bot-Purpose: monitoring / trading / info
```

---

## Existing Standards for Agent-to-Agent Protocol Docs

| Standard | Status | Recommendation |
|----------|--------|---------------|
| `llms.txt` | Widely adopted | **Already implemented** in DMF. Keep it. |
| `agent.json` | Proposed, not adopted | Not critical. JSON equivalent of llms.txt. |
| **MCP** | Rapidly emerging | **Primary interface**. Build MCP server. |
| **OpenAPI** | Mature | Use for REST API docs. Auto-generate from FastAPI. |

---

## How Crypto Projects Handle Bot-Facing Documentation

### Chainlink
- Has `llms.txt` with clear, navigable structure
- Docs are dense with code examples and contract addresses
- **Pattern to emulate**: Structured doc index + code-first examples

### Uniswap
- Has `llms-full.txt` (large single file)
- Good content but poor navigation/indexing
- **Lesson**: Don't dump everything into one file

### Aave
- No `llms.txt` found
- Relies on standard human-facing docs
- **Gap**: First-mover opportunity for DMF

### 1inch
- `llms.txt` is broken (301 redirect)
- **Lesson**: Test and maintain your bot-facing docs

---

## Recommended Approach for DMF Mentor (MVP → Full)

### Phase 1: MCP Server (Week 1)
Build a Model Context Protocol server exposing these tools:

| Tool | Description |
|------|-------------|
| `get_protocol_info` | Returns high-level DMF overview |
| `get_contract_address` | Returns address by chain+name |
| `get_fees` | Returns fee structure for an op |
| `get_backing_ratio` | **Live** on-chain backing ratio |
| `verify_invariant` | Checks an invariant on-chain |
| `get_schema_for_topic` | Returns JSON Schema for a topic |

**Why MCP first?**
- Zero deployment friction (runs locally, stdio or HTTP)
- Claude, Cursor, and other AI agents can use it immediately
- No auth needed for local use; simple for hosted

### Phase 2: REST API (Week 2-3)
Build a FastAPI service with:

```python
# Example endpoint structure
GET  /v1/topic/fee-mechanism
GET  /v1/address/{chain}/{name}
GET  /v1/backing_ratio
POST /v1/query  { "intent": "buy", "parameters": {...} }
GET  /v1/verify/{claim}
```

- JSON Schema validation with `pydantic`
- OpenAPI auto-generated docs
- Rate limiting with `slowapi` or similar
- API key auth with tiered access

### Phase 3: Bot Integration (Week 4)
- Connect Sofia (Telegram bot) to the REST API
- Sofia still does natural language, but sources answers from the structured API
- Add caching layer (Redis) for static knowledge
- Add on-chain verification layer for live data

### Phase 4: Schema & Validation (Ongoing)
- Extend `meta/SCHEMA.md` to include JSON Schema definitions for API responses
- Add CI/CD validation: every doc change must pass schema validation
- Every API response includes `sources` and `confidence` fields

---

## Files Created/Modified

- **Created**: `/home/devcontainers/dmf-knowledge/research/agent-for-agents-digest.md` (this file)
- **No existing files modified** — research only

## Issues Encountered

1. **Aave llms.txt**: Returns 404. No bot-facing doc index exists.
2. **1inch llms.txt**: Returns 301 redirect. Broken bot-facing docs.
3. **Uniswap llms.txt**: Redirect loop or 301. Unreliable.
4. **GitHub API**: Search for "agent-for-agents" returned irrelevant results. Need specific MCP/Coinbase CDP search terms.
5. **Read_file tool failure**: `read_file` failed with "No module named 'tools.read_extract'" for `.md` files. Used `cat` via terminal as workaround.

## Summary

**DMF has a strong head start**: `llms.txt`, `SCHEMA.md`, and bot guides already exist. The gap is an **API layer** that serves this knowledge in structured, machine-parseable formats.

**Best path forward**:
1. Build an **MCP server first** (fastest to deploy, highest impact for AI agents)
2. Add a **REST API** for simpler bot clients
3. Ensure **on-chain verification** for any claim that can be checked live
4. Maintain **schema validation** as a first-class concern

DMF can be a first-mover in DeFi for bot-facing documentation—most major protocols have broken or missing `llms.txt` files.