# Correction Engine / Truth Firewall Digest

**Date:** 2026-06-22
**Project:** DMF Mentor (SofiaDMF_bot /verify and mentor flows)
**Status:** Research findings + MVP spec

## 1. Existing fact-checking/correction systems for AI

- **RAG-based guardrails** (common in production): Retrieve from trusted KB first, then generate. Correction happens by grounding response in retrieved facts before output.
- **Self-critique / Reflexion loops**: Model generates draft, then critiques against KB or rules, rewrites. Used in agent frameworks.
- **Constitutional AI / rule-based filters**: Hard-coded principles or blacklists trigger overrides. E.g., "if claim matches X pattern, replace with Y".
- **External verifier agents**: Separate model or tool calls for fact extraction + verification against sources.
- **Post-generation editing**: Output parsed, claims extracted, matched to truth DB, then patched.
- Crypto/DeFi examples: Limited public ones; many projects rely on human moderation or simple FAQ bots. No mature open "truth firewall" widely deployed.

Key pattern for DMF: Combine exact-match blacklist (fast, deterministic) + semantic similarity to KB entries for robustness.

## 2. Crypto-specific truth firewall projects

None found in DMF knowledge base or standard references. 
- Related: Chainlink's on-chain data feeds (but oracle-dependent, opposite of DMF design).
- Some DeFi protocols use "invariant monitors" or Certora-style formal verification for contracts, not for AI claims.
- Community efforts like "DeFiLlama facts" or token directories act as informal truth sources but not automated correction engines.
- Conclusion: DMF Mentor would be pioneering a domain-specific Truth Firewall for its own protocol claims.

## 3. Format for correction responses

Recommended hybrid:
- **Natural language**: Short, direct correction + explanation (user-friendly). E.g., "dmfUSD is not an algorithmic stablecoin. It is fully backed by USDC reserves held on-chain..."
- **Structured JSON**: For bot consumption, logging, and downstream actions. Always append or return alongside NL.

Example JSON schema:
```json
{
  "correction": true,
  "claim_detected": "dmfUSD is algorithmic stablecoin",
  "truth": "dmfUSD is fully backed by USDC on-chain with growing reserve ratio",
  "confidence": 0.95,
  "source": "dmf-knowledge/overview/what-is-dmf.md",
  "action": "override_response",
  "blacklist_match": "algorithmic"
}
```

Bot can use JSON to decide tone, log corrections, or trigger /verify flow.

## 4. Wrong claim blacklist — common false statements about dmfUSD/DMF

Exact-match + normalized phrases (case-insensitive, lemmatized):

- "dmfUSD is algorithmic stablecoin" / "algorithmic" / "algo stable"
- "dmfUSD uses oracles" / "oracle" / "price feed"
- "dmfUSD has liquidation" / "liquidation" / "liquidate"
- "dmfUSD is 1:1 pegged" / "pegged" / "maintains peg" (note: it is >=1:1 redeemable, but not peg mechanism)
- "DMF uses LI.FI" / "lifi" / "LI.FI" (DMF uses its own cross-chain swap feature, not specified as LI.FI)
- "73 chains supported" / "73 chains" (actual: Base + 5 others = 6 mainnets listed in FAQ; testnets separate)

Additional from docs:
- "dmfUSD relies on peg mechanism"
- "dmfUSD has admin mint"
- "dmfUSD has pause/freeze"
- "backing can go below 100%"
- "dmfUSD is yield-bearing" (no, fees only strengthen reserve, no yield to holders directly)

Blacklist stored in JSON or Markdown list under meta/ for easy updates. Use fuzzy matching (Levenshtein or embedding similarity) for variants.

## 5. Confidence scoring for corrections

- **Exact blacklist match**: 0.95–1.0 (deterministic)
- **Semantic similarity** (to known wrong claims or KB contradictions): 0.7–0.9 (use embedding distance or LLM judge)
- **Partial match + context**: 0.6–0.8 (e.g., "oracle" mentioned but not claiming dmfUSD uses it)
- **Threshold policy**: >0.85 auto-correct + log; 0.6–0.85 suggest correction to user; <0.6 ignore or flag for review.
- **Sources for scoring**: Match against dmf-knowledge/ files + on-chain invariants (totalAssets >= totalSupply).

Store confidence with every correction for audit.

## 6. Proactive vs reactive correction (push vs pull)

- **Reactive (pull)**: Default MVP. Triggered on user query or when AI draft contains blacklisted claim. Mentor bot checks before final response. Low cost, user-initiated.
- **Proactive (push)**: Monitor public channels (X, Telegram, Discord) for mentions of DMF + blacklisted phrases, then reply with correction. Higher value for brand protection but requires:
  - Social listening API
  - Rate limiting / spam protection
  - Human review queue for edge cases
- Recommendation: Start reactive. Add proactive later via cron job scanning mentions (use existing scam-detection patterns as base).

Hybrid: Reactive for 1:1 chats; proactive for high-visibility false claims.

## 7. Knowledge base versioning so corrections stay current

- Use existing `meta/changelog.md` and `meta/SCHEMA.md`.
- Every correction entry references source file + commit hash or date.
- Version KB as semantic version (e.g., v1.2 adds new claim).
- On update: Re-validate all active blacklists against latest docs.
- Git-backed: Corrections live in repo; PRs for new false claims.
- Bot loads latest from `~/dmf-knowledge/` at startup or on /refresh command.
- Fallback: Hardcoded minimal blacklist in code for offline resilience.

This ensures corrections evolve with protocol (e.g., new chains added).

## 8. MVP: simplest correction engine

**Core loop**:
1. Input: User question or AI draft response.
2. Normalize + scan for blacklist phrases (simple string contains or regex).
3. If match → load canonical fact from dmf-knowledge/ (map claim → file/section).
4. Output: NL correction + JSON payload.
5. Log correction event (for metrics / improvement).

**Implementation sketch** (Python pseudocode):
```python
BLACKLIST = load_from("meta/wrong-claims.json")
KB = load_knowledge("~/dmf-knowledge/")

def correct(claim_text):
    for pattern, truth_ref in BLACKLIST.items():
        if pattern in claim_text.lower():
            fact = KB.get(truth_ref)
            return {
                "nl": f"Correction: {fact['truth']}. Source: {fact['source']}",
                "json": {"correction": True, "truth": fact, "confidence": 0.95}
            }
    return None  # no correction needed
```

**Files to create**:
- `meta/wrong-claims.json` (blacklist + mappings)
- `research/correction-engine-digest.md` (this file)
- Integrate into agents/ai-assistant-guide.md or bot prompts.

**Next steps for MVP**:
- Populate wrong-claims.json from section 4.
- Add to SofiaDMF_bot /verify command.
- Test with listed false claims.
- Keep under 100 LOC for v0.

This MVP is deterministic, zero external deps beyond existing KB, and directly addresses the 6 common wrong claims. Expand with embeddings later if needed.

---

**DMF invariants to always protect**:
- Fully USDC-backed on-chain (Base)
- Backing ratio >= 1.0 and grows via 60% fee retention
- No oracles, no liquidation, no admin mint, immutable
- 6 mainnet chains (not 73)
- Non-custodial, permissionless redeem

All corrections must reinforce these.