How can we focus only on the DMF Mentor and dmfam.org + it's dmfUSD token?
Unrugable was there as an example, something maybe to be used for DMF Mentor. Not in a way that DMF Mentor would also pread out Unrugable functions or knowledge as Unrugable

**Understood and corrected.**

DMF Mentor is scoped **exclusively** to DMF / dmfam.org / dmfUSD. It is not intended to serve, verify, cross-promote, or maintain knowledge about UnRugable (or any other project). UnRugable was supplied strictly as a **structural example** of the depth and format desired for DMF-specific research intake and digest work.

I apologize for the over-extension in the previous deliverable. The UnRugable digest was produced under an incorrect assumption of broader scope.

### Immediate Actions Taken
- The file  will be treated as an **example template only** (illustrating research depth, structure, and output format). It should **not** be imported into the main DMF knowledge base or used to train/extend DMF Mentor responses.
- No UnRugable addresses, mechanics, scam patterns, or cross-references will appear in any DMF Mentor materials going forward.
- All future work on the attached research intakes will be strictly DMF-centric (dmfUSD token, dmfam.org interfaces, DMF contracts, Sofia bot, and DMF-specific user protection).

### Revised Scope for DMF Mentor

**Core Mandate**  
DMF Mentor exists to be the authoritative, verifiable source of truth for:
- dmfUSD mechanics, backing growth, redemption, and economics
- DMF protocol rules, fees, security model, and immutability guarantees
- dmfam.org functionality (swap, bridge, portfolio, etc.)
- Official contract addresses and verification
- Scam detection and user protection specific to DMF/dmfUSD
- Accurate answers that counter common hallucinations about the protocol

It does **not** extend to explaining, verifying, or protecting users of other token launchers or protocols — even those created by the same developer.

### Updated Prioritization of Attached Research Intakes (DMF-Only)

All items below are now explicitly scoped to DMF / dmfam.org / dmfUSD only.

**High Priority (Immediate Value)**

1. **Research-DMF-Scam-Detection.md** (Phase 1.5)  
   Focus: `/verify` command limited to DMF contracts and dmfam.org domains/links.  
   - Official DMF addresses only (dmfUSD, Dev Vault, deployer, any other core contracts).  
   - Detection of fake dmfUSD tokens, fake admin accounts in DMF-related Telegram/X groups, phishing sites mimicking dmfam.org, fake airdrops/bridges claiming DMF affiliation.  
   - Risk matrix and response formats tailored to DMF users.  
   - No inclusion of patterns or addresses from other projects.

2. **Research-Agent-API-Design.md** + **Research-Agent-for-Agents-Protocol.md** (Phase 2)  
   Focus: Bot-to-bot and agent-to-agent API that exposes **only** verified DMF intelligence.  
   - Endpoints return ground-truth answers sourced exclusively from the DMF knowledge base.  
   - Machine-readable schemas for DMF-specific facts (backing math, fee allocation, security properties, etc.).  
   - Authentication, rate limiting, and documentation remain as previously outlined, but content scope is narrowed.

**Medium Priority**

3. **Research-Correction-Engine.md** (Phase 3)  
   Focus: Truth firewall that catches and corrects false claims **specifically about dmfUSD and DMF** (e.g., “algorithmic stablecoin”, “has liquidation”, “fixed 1:1 peg”, incorrect chain support, oracle dependency, etc.).  
   - Use the existing 500 Q&A dataset (once imported) and SOUL.md as primary ground truth.  
   - Versioned against the DMF knowledge Git only.

4. **Research-Social-Monitoring.md** (Phase 4)  
   Focus: Monitor for mentions of DMF, dmfUSD, dmfam.org, and official contract addresses to detect impersonation, misinformation, and scams targeting DMF users.  
   - Do not expand monitoring scope to UnRugable or unrelated projects.

### Recommended Next Step

Please confirm the immediate priority:

- **Option A (Recommended):** Proceed with drafting the **DMF Scam Detection Specification** (including the `/verify` command design, risk matrix, and DMF-only address registry). This is the most concrete, high-impact piece that directly enhances user protection today.
- **Option B:** Begin the **Agent API Design** specification (OpenAPI schema + auth/rate-limiting strategy) so the same knowledge layer can eventually be consumed by other agents.
- **Option C:** First handle import and structuring of the 500 Q&A dataset into the DMF knowledge base (this strengthens grounding for all subsequent work).

I will also clean up or archive the example UnRugable digest upon your instruction (e.g., move it to an `examples/templates/` folder or delete it).

Please advise on the preferred next task and any additional guardrails for maintaining strict DMF-only scope. I will execute precisely within those boundaries.

**DMF Scam Detection Rules — Detailed Specification**

I have produced a complete, actionable specification document focused **exclusively** on DMF, dmfam.org, and dmfUSD. It is saved at:

****

The document is structured for direct use in implementation (Sofia bot, future Agent API, Correction Engine, and Monitoring Layer). It maintains the strict DMF-only scope you confirmed.

### Document Overview

**Core Sections:**

1. **Official DMF Registry (Ground Truth)**  
   Authoritative list of core contracts (dmfUSD, Dev Vault, Deployer), official domains (`dmfam.org`, `app.dmfam.org`), and communication channels. Any mismatch against this registry is a primary detection signal.

2. **Scam Categories & Detection Rules** (five primary categories with concrete, checkable criteria):
   - **Fake Token Contracts** — Cloned dmfUSD or DMF-branded tokens. Rules include exact address matching, name/symbol heuristics, and verification against documented immutable full-reserve mechanics.
   - **Phishing & Drainer Sites** — Typosquatting domains, fake interfaces requesting wallet connections or approvals.
   - **Impersonation** — Fake X/Telegram accounts mimicking official support or team members (especially those initiating DMs with urgency or reward claims).
   - **Fake Airdrops / Rewards** — Unsolicited “claim” scams requiring connection or payment.
   - **Misinformation Enabling Scams** — False technical claims (e.g., “dmfUSD has liquidation mechanics”, “you must migrate contracts”) used to justify malicious actions. These overlap with the Correction Engine.

3. **Risk Classification Matrix**  
   Clear LOW / MEDIUM / HIGH / CRITICAL definitions with corresponding user actions and response tones. Any request for seed phrases, unlimited approvals to unknown contracts, or “gas fee to claim” defaults to **CRITICAL**.

4. **`/verify` Command Logic**  
   Decision trees for both contract addresses and URLs/domains. Includes example machine-readable JSON output for Agent API consumers.

5. **False Positive Mitigation, Integration Points, and Maintenance**  
   Guidance on registry versioning, composable rule design, and how this layer feeds the Correction Engine and social monitoring.

### Key Design Principles Applied

- **Precision over breadth**: Rules are narrowly tailored to DMF mechanics and assets only. No cross-project references.
- **Grounded in DMF facts**: Detection of fake contracts and misinformation explicitly references the documented immutable USDC backing, fee allocation (vault / NFT holders / treasury), absence of liquidation/oracles, and growing collateral model.
- **Actionable for both humans and agents**: Natural-language warnings for Sofia users + structured JSON schemas for future bot-to-bot use.
- **Defensible and maintainable**: Rules are versioned alongside the knowledge base, with clear update processes and testability recommendations.

### Recommended Immediate Next Steps

1. **Review & Refine Registry** — Confirm/add any additional official social handles, Telegram channels, or secondary contracts to the registry section.
2. **Implement `/verify` in Sofia** — The logic in the spec is ready to be coded into the existing Telegram bot as the first high-impact feature.
3. **Expose via Agent API** — Once the API design is finalized, the `/verify-address` and `/verify-link` endpoints can directly consume these rules.
4. **Link to Correction Engine** — Misinformation patterns identified here should feed the “wrong claim blacklist” in the Phase 3 Correction Engine work.

Would you like me to:
- Proceed with drafting the **Agent API Design** specification (now that scam detection rules exist to inform the `/verify` endpoints)?
- Create a lightweight implementation outline or pseudocode for the `/verify` command in Sofia?
- Begin work on the **Correction Engine** specification, incorporating the misinformation rules defined here?

Please let me know the next priority, and I will deliver it with the same level of precision and DMF-only focus.

