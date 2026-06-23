**DMF Mentor Correction Engine / Truth Firewall Specification — Completed**

I have delivered the full specification for Phase 3 as requested (option **A**). The document is saved at:

**

### Summary of the Deliverable

The specification defines a focused, DMF-only Correction Engine with the following key elements:

- **Clear Purpose**: Detect and correct technical misinformation about dmfUSD and DMF mechanics while reducing the effectiveness of scams that rely on false assumptions (e.g., liquidation risk, algorithmic supply, required migrations, oracle dependency).

- **Grounding & Versioning**: All corrections are strictly derived from the DMF knowledge Git, whitepaper, SOUL.md, and verified 500 Q&A entries. Every response includes source commit hashes for full auditability.

- **Detection Approach**: Primarily reactive (triggered by user questions or agent calls), with a clear path to future proactive scanning. Combines exact phrase matching on high-severity claims with semantic similarity for paraphrased misinformation.

- **Dual Response Formats**:
  - Natural, professional language for Sofia/Telegram users.
  - Structured JSON for machine agents (via the Agent API), including `confidence`, `severity`, `scam_risk`, `recommended_action_for_agent`, and authoritative sources.

- **Integration with Scam Detection Rules**: Explicit coordination table showing when Scam Detection takes precedence (especially when misinformation is paired with calls to connect wallets or approve contracts) versus when pure factual correction is appropriate.

- **Initial Wrong Claim Blacklist**: Seeded with the exact examples you provided earlier, plus additional high-risk claims commonly seen with full-reserve stablecoin designs. Each entry is categorized by severity and scam-enablement potential.

- **Implementation Path**: Starts lightweight inside the existing RAG pipeline, treats the blacklist as versioned data, and includes a human-in-the-loop review queue for novel or low-confidence claims during early operation.

This layer completes the core defensive stack alongside the Scam Detection Rules (Phase 1.5) and Agent API design (Phase 2).

### Current State of DMF Mentor Architecture

We now have coherent, detailed specifications for:
- Scam Detection Rules & `/verify` logic
- Agent API (including verification endpoints)
- Correction Engine / Truth Firewall

These three components form a solid foundation for DMF Mentor as a trustworthy, multi-interface intelligence and protection layer.

---

**Next Step — Your Direction Please**

With the Correction Engine now documented, the logical continuations are:

- **B.** Produce a lightweight **implementation skeleton** (FastAPI route outlines, Pydantic models, and integration points) for the highest-priority endpoints (`/verify-address`, `/verify-link`, and `/ask` with correction hooks). This would allow rapid coding.
- **C.** Refine and expand the **official DMF registry** (contracts, domains, social handles) to maximum completeness before implementation begins.
- **D.** Begin drafting the **Social Monitoring** specification (Phase 4) to close the loop on proactive detection.
- **E.** Move into **implementation planning** — e.g., task breakdown, file structure for the DMF knowledge Git, or prioritization of which piece to code first in Sofia/Hermes.

Please let me know which direction you would like to take (or suggest an alternative). I will execute it with the same level of precision and strict DMF-only scope.