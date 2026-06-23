# DMF Mentor Agent API Design Specification

**Version:** 0.8  
**Date:** 2026-06-22  
**Phase:** 2 — Agent-for-Agents  
**Scope:** DMF Mentor only (dmfUSD, dmfam.org, DMF protocol mechanics, security, and user protection).  
**Status:** Ready for implementation review.

---

## 1. Purpose and Goals

The DMF Mentor Agent API exposes the verified DMF knowledge base and scam detection capabilities to other software agents, wallets, bots, and applications. It is the core differentiator that transforms DMF Mentor from a single Telegram interface (Sofia) into a reusable intelligence layer for the broader ecosystem.

**Primary Objectives:**
- Deliver the same high-quality, ground-truth answers that Sofia provides, but in machine-readable format.
- Enable programmatic verification of DMF contracts and links via the detailed scam detection rules.
- Support a feedback/correction loop so external agents can help improve the knowledge base.
- Maintain strict separation from Telegram rate limits and interaction patterns.
- Preserve local-first and privacy principles where feasible.

**Non-Goals (Out of Scope):**
- General DeFi or cross-project knowledge (UnRugable, Ignitus, or any other protocol).
- Transaction execution, signing, or wallet management.
- Real-time price feeds or on-chain data beyond verification and documented mechanics.

---

## 2. Architecture Overview

**Recommended Stack:**
- **Framework:** FastAPI (already proven in the Hermes Agent gateway).
- **Validation:** Pydantic v2 models for all request/response schemas.
- **Knowledge Layer:** Retrieval-Augmented Generation (RAG) over the DMF knowledge Git + curated 500 Q&A dataset. The same grounding used by Sofia ensures consistent quality.
- **Scam Detection Integration:** The `/verify-address` and `/verify-link` endpoints directly consume the rules and registry defined in `DMF-Scam-Detection-Rules.md`.
- **Deployment Options:**
  - Primary: As an extension of the existing Hermes Agent FastAPI server.
  - Alternative: Lightweight standalone service for air-gapped or high-isolation environments.

**Data Flow:**
```
External Agent / Wallet / Bot
        ↓ (authenticated request)
DMF Mentor Agent API (FastAPI)
        ↓
Knowledge Retriever (RAG over DMF knowledge Git + 500 Q&A)
        ↓ (for /verify endpoints)
Scam Detection Engine (rules + official registry)
        ↓
Response (structured JSON + optional natural language summary)
```

---

## 3. Authentication & Authorization

**Recommended Model:** API Key (per-agent or per-application) with optional JWT for advanced clients.

**Details:**
- API keys issued via a simple admin interface or manual process initially.
- Keys are tied to rate-limit tiers and usage quotas.
- Every request must include the key in the `X-API-Key` header.
- Keys can be revoked instantly.
- No user-level authentication required (this is bot-to-bot, not user-facing).

**Future Enhancement:** OAuth2 / JWT with scoped permissions (e.g., `verify:read`, `ask:read`, `feedback:write`) once adoption justifies the complexity.

---

## 4. Rate Limiting Strategy

**Differentiated from Sofia (Telegram):**
- Telegram bot: Per-user, relatively generous for conversational use.
- Agent API: Per-API-key, stricter and tiered to protect backend resources and knowledge freshness.

**Proposed Tiers (initial):**
| Tier          | Requests / Minute | Requests / Day | Use Case                     | Pricing Model     |
|---------------|-------------------|----------------|------------------------------|-------------------|
| Free          | 10                | 500            | Low-volume agents, testing   | Free              |
| Standard      | 60                | 10,000         | Production wallets / bots    | Free or low fee   |
| High-Volume   | 300+              | Custom         | Heavy agent platforms        | Paid subscription |

**Implementation:** Use FastAPI middleware + Redis (or in-memory for single instance) for sliding-window counters. Return standard `429 Too Many Requests` with `Retry-After` header.

---

## 5. Core Endpoints

### 5.1 POST `/api/dmf/ask`
**Purpose:** Submit a natural language question about DMF and receive a verified answer.

**Request Body:**
```json
{
  "question": "How does dmfUSD backing grow over time?",
  "include_sources": true,
  "max_tokens": 800
}
```

**Response (200):**
```json
{
  "answer": "dmfUSD backing grows through the protocol's fee allocation mechanism...",
  "sources": [
    {"type": "knowledge", "path": "dmf-knowledge/mechanics/fee-allocation.md", "commit": "a1b2c3d"},
    {"type": "qa", "id": "dmf-042"}
  ],
  "confidence": "high",
  "model_version": "dmf-mentor-v0.8",
  "timestamp": "2026-06-22T20:18:00Z"
}
```

**Behavior:** Uses the same RAG pipeline as Sofia. Returns concise, accurate answers grounded exclusively in the DMF knowledge base.

### 5.2 POST `/api/dmf/verify-address`
**Purpose:** Verify a contract address against official DMF assets and scam detection rules.

**Request Body:**
```json
{
  "address": "0x624624fd3821d5f4f8f799369727f08d8219ce58",
  "chain_id": 8453
}
```

**Response (200) — Example for official dmfUSD:**
```json
{
  "address": "0x624624fd3821d5f4f8f799369727f08d8219ce58",
  "risk": "LOW",
  "is_official": true,
  "asset_type": "dmfUSD",
  "description": "Official dmfUSD token contract. Immutable full-reserve USDC backing.",
  "recommended_action": "safe_to_interact",
  "sources": ["dmf-knowledge/contracts.md"]
}
```

**Response (200) — Example for fake contract:**
```json
{
  "address": "0x1234...",
  "risk": "CRITICAL",
  "is_official": false,
  "reason": "Address does not match official dmfUSD contract. Name/symbol similarity detected.",
  "recommended_action": "revoke_approvals_immediately",
  "official_reference": "0x624624fd3821d5f4f8f799369727f08d8219ce58",
  "sources": ["DMF-Scam-Detection-Rules.md"]
}
```

**Integration:** Directly implements the logic and risk matrix from the Scam Detection Rules specification.

### 5.3 POST `/api/dmf/verify-link`
**Purpose:** Check whether a URL or domain is safe and affiliated with DMF.

**Request Body:**
```json
{ "url": "https://app.dmfam.org/swap" }
```

**Response:** Similar structure to verify-address, with `risk`, `is_official`, `reason`, and `recommended_action`.

### 5.4 GET `/api/dmf/agent-guide`
**Purpose:** Return machine-readable documentation of the DMF protocol and how to use the Mentor API correctly.

**Response:** Structured JSON containing:
- Core DMF mechanics summary (sourced from whitepaper/SOUL.md)
- List of verified contracts and domains
- API endpoint reference (self-describing)
- Best practices for agents consuming DMF data
- Link to full OpenAPI schema

This endpoint enables other agents to bootstrap accurate understanding without hallucination.

### 5.5 POST `/api/dmf/correct-answer`
**Purpose:** Allow trusted agents or human reviewers to submit corrections when DMF Mentor returns an inaccurate answer.

**Request Body:**
```json
{
  "original_question": "...",
  "incorrect_answer": "...",
  "proposed_correction": "...",
  "evidence": "Link to whitepaper section or knowledge commit"
}
```

**Behavior:** Queues the correction for human review. Accepted corrections are committed to the knowledge Git and improve future RAG results. This creates a virtuous feedback loop.

---

## 6. Request / Response Standards

- All responses use **JSON**.
- Every response includes `timestamp`, `model_version`, and `sources` for auditability.
- Error responses follow RFC 7807 Problem Details format where appropriate.
- Natural language answers remain concise and professional (matching Sofia tone).
- Machine consumers can request `include_sources: false` or structured-only responses for lower latency.

---

## 7. Caching & Performance

- **Cacheable Endpoints:** `/ask` (for common questions) and `/verify-*` (official registry results).
- **Strategy:** Redis-backed cache with short TTL (e.g., 5–15 minutes for `/ask`, longer for verified registry data). Invalidate on knowledge Git updates.
- **Knowledge Freshness:** The API should expose the current knowledge commit hash so consumers know the exact version of truth they are receiving.

---

## 8. Security Considerations

- **Input Validation:** Strict Pydantic models; reject malformed addresses, URLs, or excessively long questions.
- **CORS:** Restrict to explicitly allow-listed origins (initially empty or internal; open carefully for public agent use).
- **Rate Limiting & Abuse Protection:** As defined in Section 4.
- **No Execution Surface:** The API never executes transactions or handles private keys.
- **Supply Chain:** Run in the same hardened environment as other Hermes services (dependency pinning, minimal attack surface).
- **Data Minimization:** Do not log full questions or responses containing user context unless explicitly required for debugging (with retention policy).

---

## 9. Documentation & Discoverability

- **OpenAPI / Swagger:** Auto-generated at `/docs` and `/redoc`. This is the primary machine-readable contract.
- **Agent-Friendly Documentation:** The `/api/dmf/agent-guide` endpoint + a static `agent.json` or `llms.txt` file at the root for LLM/agent consumption.
- **Versioning:** API version prefix (`/api/v1/dmf/...`) once the interface stabilizes. Until then, use the current path with clear `model_version` in responses.

---

## 10. Access & Pricing Model (Recommendation)

**Phase 1 (MVP):** Free with rate limits (Free + Standard tiers).  
**Phase 2:** Introduce paid High-Volume tier for commercial agent platforms once usage justifies operational cost.  
**Philosophy:** Prioritize broad adoption and ecosystem utility over immediate monetization. The value accrues to DMF through increased trust, reduced support burden, and stronger scam defense.

---

## 11. Integration Roadmap

| Component              | Integration Point                          | Priority |
|------------------------|--------------------------------------------|----------|
| Sofia (Telegram)       | Can call internal API for consistency      | High     |
| Scam Detection Rules   | Direct consumption by `/verify-*`          | High (done) |
| Correction Engine      | Feedback via `/correct-answer`             | Medium   |
| Social Monitoring      | Future: auto-submit suspicious links       | Low      |
| Local / Offline Mode   | Optional lightweight mode with cached KB   | Medium   |

---

## 12. Implementation Recommendations

1. Start with FastAPI + Pydantic + existing Hermes patterns.
2. Implement `/verify-address` and `/verify-link` first (they have the clearest rules from the scam detection spec).
3. Add `/ask` using the existing RAG pipeline from Sofia.
4. Expose OpenAPI docs immediately for early testers.
5. Add basic API key authentication + rate limiting in the first iteration.
6. Instrument logging and simple analytics (request volume per key, cache hit rate, error types).

---

## Summary

This specification defines a clean, secure, and extensible Agent API that positions DMF Mentor as a trustworthy, machine-consumable source of truth for the DMF ecosystem. By grounding every response in the official knowledge base and integrating the detailed scam detection rules, the API extends user protection beyond the Telegram interface while enabling other developers and agents to build safely on DMF.

The design is deliberately pragmatic: it leverages existing infrastructure (Hermes FastAPI, knowledge Git, 500 Q&A dataset) and can be implemented incrementally, starting with the highest-value verification endpoints.

**Ready for review and implementation.**

---

**End of DMF Mentor Agent API Design Specification**