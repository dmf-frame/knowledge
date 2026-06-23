# DMF Mentor Correction Engine / Truth Firewall Specification

**Version:** 0.7  
**Date:** 2026-06-22  
**Phase:** 3 — Truth Firewall  
**Scope:** DMF Mentor only — dmfUSD, dmfam.org, and DMF protocol mechanics.  
**Status:** Ready for review and integration planning.

---

## 1. Purpose and Goals

The Correction Engine (Truth Firewall) is the component that actively detects, corrects, and prevents the spread of incorrect information about DMF and dmfUSD. It serves two audiences:

- **Human users** (via Sofia): Receive polite, factual corrections when they encounter or repeat misinformation.
- **Machine agents** (via Agent API): Receive structured, machine-readable corrections they can consume programmatically.

**Primary Objectives:**
- Protect users from acting on false technical assumptions about dmfUSD (e.g., believing it has liquidation risk or is algorithmic).
- Reduce the effectiveness of scams that rely on technical misinformation.
- Create a self-improving loop where corrections strengthen the knowledge base over time.
- Maintain a high bar for accuracy consistent with Sofia’s current response quality.

**Relationship to Other Layers:**
- Works alongside the **Scam Detection Rules** (misinformation that encourages harmful actions is escalated).
- Feeds and is fed by the **Agent API** (`/correct-answer` endpoint).
- Provides ground truth signals for the future **Social Monitoring** layer.

---

## 2. Core Concepts

### 2.1 Ground Truth Sources (Authoritative)
All corrections must be derived from:
- DMF whitepaper and official documentation on dmfam.org
- `dmf-knowledge/` Git repository (especially mechanics, security, and contract sections)
- SOUL.md (Sofia’s encoded facts)
- The curated 500 Q&A dataset (verified entries only)
- On-chain invariants observable from the official contracts

**Rule:** No correction may contradict these sources. If a claim cannot be definitively verified or refuted from these sources, the engine must respond with “Insufficient verified information” rather than speculate.

### 2.2 Wrong Claim Blacklist
A maintained, versioned list of common false or misleading statements about DMF/dmfUSD. Each entry includes:
- The incorrect claim (and common variations)
- The correct fact
- Severity / scam-enablement potential
- Recommended response template

### 2.3 Confidence Scoring
Every correction response includes a confidence level:
- **High**: Directly contradicted by explicit documentation or on-chain mechanics.
- **Medium**: Strongly implied by design but requires some interpretation.
- **Low**: Pattern matches known misinformation but lacks a single definitive source (rare; used for escalation to human review).

---

## 3. Detection Mechanisms

The Correction Engine can operate in two modes:

### 3.1 Reactive Mode (Primary — Pull)
Triggered when:
- A user asks Sofia a question that contains or assumes a false premise.
- An external agent calls `/api/dmf/ask` or `/api/dmf/correct-answer`.
- A message is flagged by Social Monitoring containing DMF-related claims.

**Detection Process:**
1. Normalize and embed the incoming statement/question.
2. Retrieve relevant passages from the knowledge base.
3. Compare against the Wrong Claim Blacklist using semantic similarity + exact phrase matching.
4. If a strong match is found → generate correction.
5. If partial match or novel claim → route to lightweight human review queue (initially) or respond conservatively.

### 3.2 Proactive Mode (Future — Push)
The engine periodically or on trigger scans:
- Recent Sofia conversation logs (with consent/anonymization).
- Social Monitoring output.
- High-visibility public discussions mentioning dmfUSD.

Proactive mode is lower priority and should only be activated after the reactive system and Correction feedback loop are stable.

---

## 4. Response Formats

### 4.1 For Human Users (Sofia / Telegram)
Natural, concise, and respectful tone. Structure:
1. Acknowledge the misconception politely.
2. State the correct fact clearly.
3. Provide a short “why it matters” explanation if relevant (especially for security/scam implications).
4. Link to authoritative source (whitepaper section, knowledge commit, or BaseScan).

**Example:**
> “dmfUSD is sometimes described as having liquidation mechanics or being algorithmic. This is not correct. dmfUSD is fully backed 1:1 by USDC held in an immutable contract. There is no liquidation, no oracles, and no algorithmic supply adjustment. The backing actually grows over time through protocol fees. You can verify the current backing directly on-chain.”

### 4.2 For Machine Agents (Agent API)
Structured JSON suitable for automated consumption and logging.

**Response Schema Example:**
```json
{
  "correction_id": "corr-20260622-0017",
  "original_claim": "dmfUSD has liquidation mechanics like other stablecoins",
  "is_incorrect": true,
  "corrected_fact": "dmfUSD has no liquidation mechanics. It is a full-reserve token backed by USDC in an immutable vault. Redemptions are always available at the current backing ratio.",
  "confidence": "high",
  "severity": "high",
  "scam_risk": true,
  "recommended_action_for_agent": "warn_user_and_link_official_docs",
  "sources": [
    {"type": "knowledge", "path": "dmf-knowledge/mechanics/dmfUSD-backing.md", "commit": "f4e2a1b"},
    {"type": "whitepaper", "section": "3.2"}
  ],
  "timestamp": "2026-06-22T20:19:00Z"
}
```

---

## 5. Integration with Scam Detection Rules

Many pieces of technical misinformation directly enable scams. The Correction Engine and Scam Detection Rules must coordinate:

| Misinformation Type                  | Scam Risk | Action |
|--------------------------------------|-----------|--------|
| "You must migrate to a new dmfUSD contract" | Critical | Scam Detection triggers CRITICAL + Correction provides factual response |
| "dmfUSD can be liquidated if backing drops" | High | Correction + warning not to approve unknown contracts |
| "Connect your wallet to verify for the new secure version" | Critical | Scam Detection dominant response |
| Incorrect chain count or feature claims | Medium | Correction only (unless used to justify malicious link) |

**Rule:** When a claim has both misinformation and action-request elements (wallet connection, approval, payment), **Scam Detection takes precedence** in the response priority, while the Correction Engine still supplies the factual counter-statement.

---

## 6. Wrong Claim Blacklist — Initial Seed (DMF-Specific)

| Incorrect Claim (and variations)                          | Correct Fact                                                                 | Severity | Notes |
|-----------------------------------------------------------|----------------------------------------------------------------------------------|----------|-------|
| "dmfUSD is an algorithmic stablecoin"                     | dmfUSD is fully collateralized 1:1 by USDC in an immutable contract. No algorithm controls supply. | High     | Common confusion with other designs |
| "dmfUSD uses oracles for collateral valuation"            | No oracles are used. Backing is direct USDC held on-chain and verifiable.       | High     | Core differentiator |
| "dmfUSD has liquidation mechanics"                        | There are no liquidations. Holders can always redeem directly for USDC.         | High     | Prevents fear-based scams |
| "dmfUSD maintains a strict 1:1 peg at all times"          | Backing starts at 1:1 but grows over time as fees are allocated to the vault.   | Medium   | Important for accurate expectations |
| "You need to migrate/upgrade your dmfUSD to a new contract" | No migration is required or exists. The current contract is immutable.         | Critical | Frequently used in drain scams |
| "dmfUSD is available on 70+ chains"                       | dmfUSD is deployed on Base Mainnet only.                                        | Medium   | Limits cross-chain scam vectors |
| "DMF uses [specific bridge provider] for swaps"           | Do not name external providers. Focus on on-chain mechanics only.               | Low      | Branding / dependency risk |
| "dmfUSD can be frozen or seized by admins"                | The protocol has no admin keys capable of freezing or seizing user funds.       | High     | Reinforces immutability |

This list will be expanded and versioned in the knowledge base. Each entry should include regex or embedding patterns for detection.

---

## 7. Knowledge Versioning & Auditability

- Every correction response includes the knowledge commit hash and relevant source paths.
- Corrections that are accepted via the `/correct-answer` feedback loop are committed to the knowledge Git with clear provenance.
- The engine must gracefully handle knowledge updates: a claim that was previously ambiguous may become definitively correct or incorrect after a protocol change or documentation improvement.

---

## 8. Implementation Recommendations

1. **Start Reactive** — Implement detection inside the existing RAG pipeline for `/ask` and Sofia message handling.
2. **Blacklist as Data** — Store the Wrong Claim Blacklist as structured data (JSON/YAML) in the knowledge Git so it can be versioned and reviewed like any other fact.
3. **Hybrid Detection** — Combine exact phrase matching (for high-severity claims) with semantic similarity (for paraphrased misinformation).
4. **Human-in-the-Loop Initially** — Route low-confidence or novel claims to a review queue (visible to you or trusted reviewers) before the engine auto-responds.
5. **Metrics** — Track correction frequency, acceptance rate of feedback, and reduction in repeated misinformation over time.
6. **Performance** — Keep the correction layer lightweight so it does not materially increase latency on `/ask` or Sofia responses.

---

## 9. Success Criteria

- Users encountering common misconceptions receive immediate, accurate corrections.
- External agents calling the API can programmatically detect and surface misinformation to their own users.
- The volume of repeated false claims in monitored channels decreases over time.
- The knowledge base measurably improves through accepted corrections.

---

## Summary

The Correction Engine completes the core defensive layers of DMF Mentor:

- **Scam Detection Rules** → Prevent harmful actions (Phase 1.5)
- **Agent API** → Expose verified intelligence to other systems (Phase 2)
- **Correction Engine** → Actively defend the truth and reduce confusion (Phase 3)

Together they create a robust “truth and safety” perimeter around dmfUSD and dmfam.org.

This specification is ready to be reviewed and implemented once the Agent API foundation (especially the `/correct-answer` endpoint) is in place.

**End of DMF Mentor Correction Engine Specification**