# UnRugable Chaos — DMF Mentor Knowledge Base Digest

**Date Compiled:** 2026-06-22  
**Source:** Official GitHub (UNRUGABLE/Chaos), unrugable.com, contract source, verification tooling, creator context (0xMarZel)  
**Status:** Verified project by same creator as DMF (0xMarZel). Recommended for /verify support and cross-project awareness.  
**Priority for DMF Mentor:** High — reinforces "safe by design", immutable, USDC-collateralized narrative shared with dmfUSD.

---

## Full Project Overview

UnRugable Chaos is a decentralized meme token launcher platform deployed on **Base Mainnet**. It enables creators to launch ERC-20 tokens that are **permanently backed by USDC** with **on-chain, instant redemption** capability. 

**Core Value Proposition:** 
- **No rug possible** — mathematically and cryptographically enforced. Creators cannot withdraw backing USDC. Contracts are immutable and ownership is renounced at launch.
- **Inverse bank run mechanic** — user exits (redemptions) strengthen the backing ratio for remaining holders via a retained fee that boosts reserves.
- **Always redeemable** — any holder can burn tokens directly with the contract to receive proportional USDC at the current backing price (totalUSDCBacking / circulating supply).
- **Creator incentives aligned** — fees benefit creators on volume, not upfront extraction. Platform takes small cut for sustainability.
- **Transparency-first** — all mechanics on-chain, verifiable source, subgraph indexing, dedicated per-token chat and analytics.

**Philosophy Alignment with DMF:**
Both projects (created by 0xMarZel) emphasize **immutability, no admin keys, collateralized by USDC, and user protection through code/math** rather than trust or oracles. dmfUSD provides growing USDC backing; UnRugable tokens provide dynamic but always-backed USDC redemption. Synergies exist for future integration (e.g., dmfUSD as backing asset for UnRugable launches, shared verification tooling, cross-audience education on safe tokenomics).

**Chain:** Base Mainnet (Chain ID 8453)  
**Token Standard:** Custom ERC-20 (`UnrugableToken`) with extended backing, mint-on-deposit, and refund-on-transfer-to-self logic.  
**Status:** Live. Low but growing activity; open-source core logic.

---

## Architecture and Contracts

### Core Contract: `UnrugableToken` (UnRugable.sol)
- **Location:** https://github.com/UNRUGABLE/Chaos/blob/main/UnRugable.sol
- **Type:** ERC-20 with custom economics. Inherits `ERC20`, `Ownable2Step`, `ReentrancyGuard`.
- **Key State:**
  - `totalUSDCBacking`: Tracks locked USDC available for redemptions.
  - `creatorFeeRecipient`, `devFeeRecipient` (immutable post-renounce), `USDC` (IERC20).
- **Constructor Params (fixed for all tokens, used in verification):**
  - `_creator`: `0x7A1255992a4597083CF9E8468D17a60D73d8F6D4`
  - `_devFeeRecipient`: `0x4eaf3fe591898895102dfbc7487f45bab4454deb`
  - `_usdc`: `0x036CbD53842c5426634e7929541Ec2318f3dCf7E` (USDC token used by platform)
  - `name`, `symbol` (per token)
- **Deployment:** Via platform factory (mentioned in README; address not publicly indexed in sources — tokens launched through unrugable.com interface). Each token is self-contained with its own backing reserves.
- **Immutability:** Ownership renounced at launch. No upgradeability, no admin functions to drain backing. `setCreatorFeeRecipient` exists pre-renounce only.
- **Security Patterns:** `ReentrancyGuard` on buy/refund, safe math (`Math.mulDiv`), non-withdrawable backing, proportional redemption.

### Factory (Inferred from README)
- Deploys `UnrugableToken` instances.
- Tracks launch metadata (name, symbol, creator, image URI?).
- Not fully open-sourced in repo or address published in public docs. For verification purposes, focus on individual token contracts using the fixed constructor args above.

### Other Components
- **Frontend:** https://unrugable.com/ — launch interface, buy/refund UI, per-token dashboards, chat rooms.
- **Verification Tool:** https://unrugable.com/verify — provides flattened source + exact compiler settings (Solidity 0.8.31, optimizer 200 runs, viaIR) and constructor args for BaseScan verification via Remix.
- **Subgraph:** Indexes launches, trades, redemptions for real-time UI data (not public endpoint detailed).
- **Example Verified Token:** `0x3e96b75ba40db5b1aa70c4eb07abc78436f04dc9` (UnRugable / UNR) — demonstrates full verification flow.

**Token Lifecycle:**
1. Creator launches via platform (gas only, no platform launch fee).
2. Token deploys with renounced ownership.
3. Users **buy**: Send USDC → contract mints tokens at current backing price.
4. Users **refund**: Send tokens to contract address → receive proportional USDC (minus fees, with backing boost retained).
5. P2P trading on DEXes possible (no contract fees on secondary transfers).
6. Every tx increases permanent backing via 0.5% allocation.

**Math Invariant (Rug-Proof):**
- Backing USDC is locked forever in contract.
- Redemption price = `totalUSDCBacking / circulatingSupply` (scaled for decimals: 1e18 / 1e6).
- No function allows creator/platform to extract `totalUSDCBacking`.

---

## Fee Mechanics vs DMF Comparison

### UnRugable Fee Structure (1% total per tx, paid in tokens)
| Component       | BPS  | %    | Recipient          | Notes |
|-----------------|------|------|--------------------|-------|
| Creator Fee     | 30   | 0.3% | Creator            | Incentivizes long-term volume |
| Platform/Dev Fee| 20   | 0.2% | Dev recipient      | Sustainability |
| Backing Boost   | 50   | 0.5% | Retained in reserves | **Key differentiator** — permanently adds to `totalUSDCBacking` |
| **Total**       | 100  | 1.0% | —                  | Applied on buy and refund paths |

- **On Buy:** Fee deducted from minted tokens; backing increased by full USDC deposited.
- **On Refund:** 0.5% of calculated USDC value retained as boost; 99.5% paid out. Tokens burned.
- **Effect:** Creates sticky backing growth. High activity → stronger per-token redemption value over time.

### Comparison to DMF (dmfUSD / DMF Protocol)
- **DMF:** Focuses on dmfUSD as over-collateralized/growing USDC-backed stable (backing grows via protocol fees: 50% to vault boost, 30% to NFT holders, 20% treasury). Immutable vaults, no liquidation, on-chain redemption/growth flywheel. Fees benefit holders via backing appreciation.
- **UnRugable:** Per-token USDC backing with dynamic price (not pegged stable). 1% tx fee split to creator/platform + 0.5% permanent backing boost. Similar "backing grows with activity" flywheel but applied per launched token. No NFT membership or multi-tier rewards; simpler creator/platform split.
- **Shared DNA:** Both enforce collateralization mathematically, immutable design, USDC reserves protected from admin drain, fee-driven backing appreciation for holders. UnRugable extends the philosophy to arbitrary meme tokens ("every token is unrugable").
- **Potential Synergy:** Future support for dmfUSD as the reserve asset in UnRugable launches (passing DMF's growing backing mechanic to launched tokens). Shared /verify tooling across both projects' contracts on Base. Cross-education on "safe tokenomics."

**DMF Mentor Note:** When answering "how does UnRugable compare to DMF?", emphasize complementary safe-design patterns rather than competition. Both counter traditional LP/rug-prone launchers.

---

## Security Audit Summary

- **No public third-party audit report** found in GitHub repo or official channels (as of 2026-06-22).
- **Internal/Comprehensive Testing:** 
  - `UR_Security/COMPREHENSIVE_TEST_REPORT.md` and `UR_Comprehensive_report.md` in repo.
  - Claims coverage of **over 230 million test scenarios** via Foundry.
  - Focus: Likely edge cases for backing math, refund precision, reentrancy, fee splits, supply invariants, rounding (MIN_AMOUNT = 0.001 USDC).
- **Security Posture (from code & design):**
  - `ReentrancyGuard` on critical paths.
  - Immutable post-renounce; no privileged withdrawal of backing.
  - Safe arithmetic and proportional math prevent insolvency.
  - Ownership renounced → no future admin takeover or backdoors.
  - Source verifiable on BaseScan for every launched token.
- **Recommendation for DMF Mentor:** Treat as **high-assurance by design** (similar to DMF's immutable vaults). Flag any token claiming to be UnRugable but failing constructor arg verification or lacking renounced ownership as high-risk fake. Recommend users verify via official guide + BaseScan green check.

**DMF Mentor /verify Enhancement:** Extend address verification to accept UnRugableToken contracts if they match the fixed constructor args (`_creator`, `_devFeeRecipient`, `_usdc`) and show renounced ownership + verified source.

---

## Scam Detection Patterns for UnRugable

Common attack vectors targeting users of meme launchers like UnRugable (and DMF):

1. **Fake Tokens / Impersonation Contracts**
   - Cloned names/symbols (e.g., "UnRugableX", fake UNR).
   - Deployed without proper backing or using different USDC.
   - **Detection:** Check constructor args match official fixed addresses; verify source on BaseScan matches official `UnRugableToken`; confirm `totalUSDCBacking > 0` and renounced ownership. Use DMF Mentor's /verify.

2. **Fake Websites / Phishing Frontends**
   - Domains like unrugable-app.com, unrugable-claim.net mimicking unrugable.com.
   - **Detection:** Official site only unrugable.com. Warn on any link asking for approvals, seed phrases, or "connect to claim".

3. **Fake Admins / Support Impersonation (Telegram/X)**
   - Accounts claiming to be @UNRUGABLEcom support or creator (@0xMarZel impersonators).
   - Promises of "early access", "whitelist", "refund bonuses", or airdrops requiring wallet connection.
   - **Detection:** Official channels only. Never DM for support. Creator is transparent via X @0xMarZel / @UNRUGABLEcom.

4. **Fake Airdrops / "Verify to Claim" Scams**
   - Links promising free tokens or USDC refunds for "verifying" holdings.
   - **Detection:** UnRugable has no airdrop mechanics. Redemption is direct on-chain via contract interaction (no claim site needed).

5. **Approval Phishing / Drainers**
   - Malicious sites requesting unlimited USDC or token approvals.
   - **Detection:** Only interact with official unrugable.com or verified DEX aggregators. Revoke approvals regularly.

6. **Impersonation of Verified Badges**
   - Fake tokens claiming "Audited by UnRugable" or "Official Launch".
   - **Detection:** Only tokens launched via platform with matching constructor and renounced status are authentic.

**DMF Mentor Response Pattern for /verify:**
- If address matches UnRugableToken pattern → "Verified UnRugable token. Backing: X USDC. Redemption available. Creator: [address]. Renounced: Yes."
- Risk levels: LOW (matches official template + verified source), HIGH (mismatch on constructor/USDC backing/ownership), CRITICAL (known drain patterns or impersonation signals).
- Cross-link to DMF contracts where relevant (shared Base ecosystem, same creator ethos).

**Proactive Monitoring (Phase 4):** Track mentions of "UnRugable", "unrugable.com", specific token addresses on X/Telegram for scam clusters.

---

## FAQ for DMF Mentor (Sample Ground-Truth Answers)

**Q: What is UnRugable?**  
A: UnRugable Chaos is a token launcher on Base where every launched token is permanently backed by locked USDC. Holders can instantly redeem (burn) tokens for proportional USDC on-chain at any time. It eliminates rug pulls through immutable code and economic design (inverse bank run via retained backing fees).

**Q: How is the backing guaranteed?**  
A: USDC sent to the token contract is locked with no withdrawal function. Redemption math uses `totalUSDCBacking / circulatingSupply`. 0.5% of every transaction's value is permanently retained as additional backing, strengthening the floor over time.

**Q: Is UnRugable related to DMF / dmfUSD?**  
A: Yes — both are projects by 0xMarZel emphasizing USDC collateralization, immutability, and math-enforced safety on Base. DMF focuses on the dmfUSD stable with growing backing and NFT rewards; UnRugable applies similar principles to permissionless meme token launches. Future synergies possible (e.g., dmfUSD-backed UnRugable tokens).

**Q: How do I safely buy/refund an UnRugable token?**  
A: Use the official interface at unrugable.com. Always verify the specific token contract on BaseScan (green check + source matches official UnRugableToken with correct constructor args). Never approve tokens/USDC to unverified sites.

**Q: What happens during mass redemptions (bank run)?**  
A: Unlike traditional models where exits collapse price, UnRugable's design retains 0.5% backing on every refund while reducing supply by 100%. This increases the backing-per-token ratio for remaining holders — an "inverse bank run" that self-stabilizes.

**Q: Are there audits?**  
A: Comprehensive internal testing (230M+ scenarios via Foundry) covers core invariants. Contracts are immutable/renounced post-launch and source-verifiable on BaseScan. No public Certik/PeckShield-style report identified; rely on code transparency and verification tooling.

**Q: Can I launch my own token on UnRugable?**  
A: Yes — visit unrugable.com, deploy with custom name/symbol (gas only). Your token will have the same unrugable mechanics. Consider verifying it immediately via the official guide.

---

## Official Addresses and Links Registry

**Official Links:**
- Website: https://unrugable.com/
- GitHub: https://github.com/UNRUGABLE/Chaos
- X/Twitter: @UNRUGABLEcom (platform), @0xMarZel (creator)
- Verification Tool: https://unrugable.com/verify
- Example Verified Token: https://basescan.org/address/0x3e96b75ba40db5b1aa70c4eb07abc78436f04dc9

**Key Contract Addresses (Base Mainnet):**
- USDC (platform): `0x036CbD53842c5426634e7929541Ec2318f3dCf7E`
- Fixed Creator (constructor): `0x7A1255992a4597083CF9E8468D17a60D73d8F6D4`
- Fixed Dev Fee Recipient: `0x4eaf3fe591898895102dfbc7487f45bab4454deb`
- Example Token (UnRugable/UNR): `0x3e96b75ba40db5b1aa70c4eb07abc78436f04dc9`

**DMF Mentor Integration Notes:**
- Add above to contract registry for /verify-address.
- Support verification of any UnRugableToken by checking constructor args + renounced status + verified source.
- Scam patterns shared with DMF (fake contracts, phishing, impersonation) — unified detection logic beneficial.
- Update knowledge base when new official addresses (factory, subgraph, popular tokens) are published by creator.

---

**End of Digest.**  
This document equips DMF Mentor (Sofia + future Agent API) to provide accurate, verifiable answers about UnRugable, support cross-project queries, enhance /verify coverage, and protect users from related scams. Maintain versioned updates as protocol evolves or new synergies (e.g., dmfUSD backing) are implemented.

*Compiled for DMF Mentor knowledge base expansion. All facts cross-referenced from primary sources (contract, GitHub, site).*
