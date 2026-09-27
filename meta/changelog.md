---
title: DMF Knowledge Base Changelog
description: Version history and changelog for the DMF Knowledge Base
audience: both
section: meta
order: 2
---

# DMF Knowledge Base Changelog

## 2026-09-30
- Third external check (`dmf_v2_check_3.txt`) required no doc change. Both items it flagged as still open were already closed on `main`: the "privileged routing entrypoints ... configured caller" wording was removed in the 2026-09-29 consistency pass, and the ERC-4626 framing it quotes ("a standard ERC-4626 vault interface" with `deposit()`/`mint()`/`withdraw()`/`redeem()`) appears nowhere in this repository's history — a `git grep` across every revision returns zero hits — and the file has stated the opposite since the 2026-09-28 alignment pass. Re-verified against the published `main` blobs, the live dmfam.org surface (`llms.txt`, `/white-paper`, `/risk`) and `scripts/validate-knowledge.mjs` (exit 0). The check's other three "fixed" items all landed in the same pass as the two it flagged, so it read a mixed snapshot.
- Tightened the one real leftover it missed: `protocol/smart-contracts.md` and `protocol/invariants.md` #9 read "the only owner-only function is `setDevFeeRecipients()`" while the access-control table — and the deployed contract — also expose Ownable2Step's `transferOwnership()`. Both lines now name it as ownership-only, so the owner-only claim is exact rather than open to a contradiction reading.

## 2026-09-29
- Consistency pass against the deployed surface (site `DMF_web_v2` and the KB at their then-current tips, dmfam.org live):
  - Fee wording: the last three "fees add excess reserves (without minting new tokens)" lines — `guides/faq.md`, `overview/what-is-dmf.md`, `protocol/smart-contracts.md` — now state both legs (60% / 0.15% retained as USDC backing, 40% / 0.10% minted as dmfUSD for operations). Same alignment in `reference/comparison/vs-traditional-stablecoins.md` and `reference/comparison/backed-token-models.md`.
  - `overview/key-concepts.md`: dropped the absolute "nobody can stop you" / "removes counterparty risk entirely" claims; the remaining dependencies (Base network, USDC issuer blacklist) are now named.
  - WebMCP counts: `agents/ai-assistant-guide.md`, `agents/webmcp-e2e-test-agent.md`, `agents/webmcp-tool-catalog.md` (frontmatter) and `index.md` now say 7 registered tools (site_ask_support parked), matching the registered surface.
  - `overview/architecture.md`: "single, audited smart contract" → "single, immutable smart contract" — no external audit firm has been engaged, consistent with `meta/wrong-claims.json`.
  - `security/testing-approach.md`: row relabelled "Unit + economic tests" (36 tests, not unit-only) and the related-doc link now carries the real title, "Security Summary (in-house)".
  - `meta/wrong-claims.json`: audit-summary date reference corrected from 2026-05-15 to the current 2026-09-28.
  - Frontmatter: five files carried `date: 2025-05-19` (a year off the real 2026-05-19 creation date) — set to their true last-modified dates.

- Second consistency pass (external check `dmf_v2_check_2.txt`) — 4 of its 5 items were real, and one was inverted:
  - `protocol/invariants.md` #7 now states the refund's real net supply change (`devCommissionDmfUsd - tokenAmount`, with the `totalBurned` / `totalMinted` legs and the Certora `supply_tracking` invariant) instead of "exactly the burn amount".
  - `protocol/smart-contracts.md`: the "privileged routing entrypoints / configured route caller" claims and two access-control table rows were removed — they described a contract that does not exist. The table is now `buy()`/`refund()`/`refundTo()` (anyone) + owner-only `setDevFeeRecipients()` + `transferOwnership()`, and the quoted source comment was replaced with the real one (`// No separate reserve accounting — balanceOf(this) IS the reserve.`).
  - `agents/webmcp-e2e-test-agent.md`: the last 8-tool assertions (frontmatter, `assertNoExecutionTools` expected set, registration matrix, spec-file comments) now read 7 registered with `site_ask_support` parked; version 2.0.1.
  - `education/how-to-verify-backing.md`: the backing-ratio statement now covers buys, refunds and direct USDC transfers to the contract.
  - `security/certora-verification.md`: caller list no longer names a "privileged route caller", and the prover command now matches the real `certora/conf/*.conf` runs from the repo root.
  - `security/invariants-testing.md`: handler list corrected — `transfer` was listed twice; the handler targets exactly `buy`, `refund`, `refundTo`, `transfer`.
  - `meta/wrong-claims.json`: + `wc-031` (privileged / route-only entrypoints).
  - Ground truth for the routing question: `app/dmftokens/dmfUSD.sol` was rebuilt under the repo-root `foundry.toml` (via_ir, optimiser 200) and diffed against `cast code 0x3a6f90b8517ff16b7a8c368f05f38bb03afd4aa7` — identical apart from constructor-injected immutable slots, with an identical CBOR metadata hash. The deployed contract has no routing entrypoints, so the routing claims were the stale copies, not the invariant. The live `/risk` page carried the same claim and was corrected in the site repo.

## 2026-09-28
- Independent 100k-run re-verification on a second host (16 threads): 60/60 pass, every invariant `runs: 100000, calls: 12800000` (8 × 12.8M = 102.4M invariant calls) plus 1.6M fuzz cases = 104.0M executed operations. Every published count reproduced.
- Full KB pass against the deployed reality: contract state read live from Base (`totalSupply` 0, USDC reserve 0, `getBackingPerToken()` 1.0), contract source re-checked, and the Foundry suite re-run (60/60 pass).
- Terminology: removed the remaining "ERC-4626 token/vault" framing — dmfUSD is an ERC-20 with an **ERC-4626-style read-only quote surface** (no `deposit`/`mint`/`withdraw`/`redeem`).
- Test counts corrected to the real split: 60 = 24 unit + 12 economic scenario + 16 fuzz + 8 invariant (re-run and green today at default settings; the 100k-run counts come from the root `foundry.toml` profile).
- Fee wording fixed: the whole 0.25% fee does not flow into the reserve — 60% (0.15%) stays as USDC backing, 40% (0.10%) is minted as dmfUSD for operations.
- `agents/AGENTS.md` directory map replaced with the real tree; `meta/SCHEMA.md` + `CONTRIBUTING.md` aligned with the nine real sections and the actual validator script.
- Frontmatter added to every content file; `scripts/validate-knowledge.mjs` rewritten (it previously crashed on `tags: [ ... ]`) and now runs clean.
- Comparison table, invariants list, verification guide and roadmap corrected (USDC reserve model, peg/refund wording, live-state honesty, owner split).
- Added `research/README.md` marking the research drafts as historical, not canonical.

## 2026-09-27
- Knowledge base reviewed and aligned with the current Base mainnet deployment and the dmfam.org website.

## 2026-05-20
- **dmfUSD deployed to Base mainnet** at `0x3a6f90b8517ff16b7a8c368f05f38bb03afd4aa7`
- Verified on BaseScan (exact_match)
- Two dev fee recipients with a 50/50 split (5000 bps)

## 2026-05-19
- Initial knowledge base created with 25+ files across 8 sections.
- Sections: agents, contracts, docs, integrations, meta, scripts, tests, tools.
- Includes: protocol specification, whitepaper, API reference, contract ABIs, integration guides, AI agent instructions, validation scripts.
- Covers: buy/refund operations, fee structure, backing verification, security guidelines.
