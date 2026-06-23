**DMF Mentor Agent API Design Specification — Completed**

I have drafted the full specification document. It is saved at:

****

The design is tightly scoped to DMF / dmfam.org / dmfUSD only and directly incorporates the scam detection rules and risk matrix from the previous deliverable.

### Key Design Highlights

**Architecture**
- Built on **FastAPI** (leveraging the existing Hermes Agent gateway pattern you already use).
- All responses are grounded in the DMF knowledge Git + 500 Q&A dataset via RAG, ensuring Sofia-level accuracy in machine-readable form.
- `/verify-address` and `/verify-link` endpoints directly consume the detailed scam detection rules, official registry, and risk classification (LOW / MEDIUM / HIGH / CRITICAL) you approved.

**Core Endpoints Defined**
- `POST /api/dmf/ask` — Natural language questions with source citations and confidence scoring.
- `POST /api/dmf/verify-address` — Contract verification with risk level, reason, recommended action, and official reference (fully aligned with the scam detection logic).
- `POST /api/dmf/verify-link` — Domain/URL safety checking.
- `GET /api/dmf/agent-guide` — Machine-readable bootstrap documentation for other agents.
- `POST /api/dmf/correct-answer` — Structured feedback loop for corrections (feeds the future Correction Engine).

**Authentication & Operations**
- API key per agent/application (simple to start, revocable).
- Tiered rate limiting differentiated from the Telegram bot (Free / Standard / High-Volume).
- Caching strategy for performance and knowledge freshness (exposes commit hash).
- Strict input validation, CORS controls, and no execution surface.

**Documentation & Agent Ergonomics**
- Auto-generated OpenAPI/Swagger at `/docs`.
- Dedicated `/agent-guide` endpoint + recommendation for `agent.json` / `llms.txt` style files.
- Every response includes `sources`, `timestamp`, `model_version`, and `confidence` for auditability and trust.

**Implementation Path (Pragmatic & Incremental)**
1. Start with `/verify-address` and `/verify-link` (clearest rules already defined).
2. Add `/ask` using the existing Sofia RAG pipeline.
3. Layer on authentication + rate limiting.
4. Expose OpenAPI documentation immediately for early consumers.
5. Add the correction feedback endpoint once the Correction Engine work begins.

This creates a clean separation between the knowledge/scam logic and the transport layer, making the system maintainable and extensible.

### Next Steps — Your Direction Requested

Please indicate the preferred continuation:

- **A.** Begin drafting the **Correction Engine / Truth Firewall** specification (Phase 3), incorporating the misinformation patterns already identified in the scam detection rules.
- **B.** Produce a lightweight **implementation skeleton** (FastAPI route outlines + Pydantic models) for the highest-priority endpoints so you can begin coding quickly.
- **C.** Refine the **official registry** section (add any additional contracts, social handles, or Telegram channels) and then move to implementation planning.
- **D.** Something else (e.g., social monitoring draft, local/offline mode considerations, or integration notes for Sofia).

I am ready to proceed with whichever item advances the DMF Mentor vision most effectively.