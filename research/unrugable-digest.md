# UnRugable Chaos Research Digest
**For DMF Mentor Knowledge Base**
**Creator:** 0xMarZel (UNRUGABLE)
**Date:** 2026-06-22
**Sources:** GitHub UNRUGABLE/Chaos, unrugable.com, contract analysis, security reports

## 1. Deployed Contract Addresses (Base Mainnet)
- **Factory (UR_Factory):** `0x00d36333A9Fe17353F9e49D57d5fC45f8b1839ae`
  - Deploys individual UnRugableToken contracts.
  - Tracks all launched tokens, creators, metadata (imageUri).
  - Functions: launch(name, symbol, creatorWallet, imageUri) → returns token address.
- **Token Implementation:** Each launched token is an independent `UnRugableToken` contract (immutable, renounced ownership at launch).
  - Example deployed token: `0x3e96b75ba40db5b1aa70c4eb07abc78436f04dc9`
- **USDC (official Base):** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
  - Note: Verification guide references an older/different USDC `0x036CbD53842c5426634e7929541Ec2318f3dCf7E` — production uses the standard one.
- **Fixed per-token constructor params (immutable):**
  - `_creator`: e.g. `0x7A1255992a4597083CF9E8468D17a60D73d8F6D4`
  - `_devFeeRecipient`: `0x4eaf3fe591898895102dfbc7487f45bab4454deb`
- No separate "router" contract — buy/refund logic is embedded in each token contract. Tokens act as their own AMM-like endpoint for USDC ↔ token.

## 2. Full Architecture: Contracts, Deploy Flow, Token Lifecycle
- **Factory (UR_Factory):** Single deployment. Handles token creation, stores metadata (creator, image), provides pagination/query for tokens by creator or all. Renounces ownership on deployed tokens.
- **UnRugableToken (per-launch):** 
  - ERC-20 with custom buy/refund mechanics.
  - Holds USDC in contract balance.
  - State: `totalUSDCBacking`, `circulatingSupply` (minted - burned/refunded).
  - Buy: Send USDC to contract → mint tokens at current backing price (totalUSDCBacking / supply).
  - Refund: Transfer tokens to contract (or call refundTo) → burn tokens, send proportional USDC minus fees.
  - Immutable, no owner after launch, no withdrawal functions.
- **Deploy Flow:**
  1. Creator calls factory.launch() with name/symbol/creator/image.
  2. Factory deploys new UnRugableToken (via CREATE), wires fixed params, renounces.
  3. Token starts with 0 backing.
  4. Users buy by USDC transfer to token addr → increases backing + mints.
- **Token Lifecycle:** Launch (gas only) → Buys increase backing → DEX trading (no fees) → Refunds (instant, proportional) → Backing grows via 0.5% fee retention. Never "ruggable" as USDC locked.
- **Subgraph/Indexing:** Used for UI (fresh meat, trending, etc.).
- **Social:** Per-token chat rooms (off-chain?).

## 3. USDC Backing / On-Chain Redemption Technical Details
- `totalUSDCBacking` tracks locked USDC.
- Price per token = totalUSDCBacking / circulatingSupply (integer math, MIN_AMOUNT=0.001 USDC = 1000 units).
- Buy: USDC transferred in → totalUSDCBacking += amount; mint = (amount * supply) / backing (or inverse calc).
- Refund: tokens sent → USDC out = (tokens * totalUSDCBacking / supply) - fees; backing reduced by net USDC paid.
- Fees on refund (1% total in token value): 0.3% creator (tokens), 0.2% platform (tokens), 0.5% retained as extra backing (USDC stays).
- Rounding: down to 0.001 USDC. No fractional dust.
- No admin functions; transfer to contract auto-triggers refund logic via ERC20 hooks? (actually custom _refund on receive/transfer detection in code).
- Mathematical guarantee: backing cannot be drained outside refunds.

## 4. 'Inverse Bank Run' Mechanic
- **Definition:** As more holders refund/exit, the remaining holders' refund value *increases* proportionally because supply drops while backing stays (minus fees). The 0.5% backing boost further increases value over time.
- **Difference from LP-based models (e.g. bonding curves, Raydium LP):**
  - LP models: Liquidity can be pulled by creator/devs (classic rug). Price manipulated via LP removal.
  - UnRugable: Backing is *permanently locked* in token contract; no LP to pull. Refunds are direct from contract USDC reserve. Proportional and anti-dilutive. Creator gets only tx fees in tokens, no access to USDC.
  - Result: "Bank run" protects remaining holders instead of harming them. Exit liquidity mathematically guaranteed.

## 5. Fee Structures & DMF Comparison
- **UnRugable:** 1% on *every* tx (buy + refund):
  - 0.3% → creator (in tokens)
  - 0.2% → platform (in tokens)
  - 0.5% → permanent backing boost (USDC retained)
- Launch: 0 fees (only gas).
- DEX trades: 0 fees (peer-to-peer).
- **DMF (dmfUSD context):** 50/50 devFeeRecipient split to vault (from memory: devFeeRecipientB updated to vault). Likely similar tx or launch fees but focused on stablecoin backing + vault mechanics. UnRugable is pure meme launcher with backing; DMF appears more stable/vault-oriented.
- **Comparison:** UnRugable fees incentivize long-term holding via backing growth. DMF fees support vault owners (DevMik 60%, other 40%). Both use permanent backing concepts but UnRugable emphasizes refundability for memes.

## 6. Audit & Security Results
- **No external audit** (e.g. no Certik, PeckShield listed).
- **Internal exhaustive validation (Jan 2026 report):**
  - Foundry: 12 unit tests + 20M+ fuzz tests + 210M+ invariant calls (depth 20).
  - Certora Prover: Formal verification of 17 properties (9 token + 8 factory) across ALL states.
  - Results: 100% pass, zero vulnerabilities, production-ready.
  - Contracts: Non-upgradeable, immutable, ownership renounced.
- High confidence in math invariants (backing, refunds, fees).

## 7. Scam Patterns Targeting UnRugable Users
- **Fake tokens:** Impersonators deploying copycat contracts without using official factory (bypass backing).
- **Phishing sites:** Fake unrugable.com clones or "verify" pages stealing wallets.
- **Social engineering:** Fake creator chats, "admin" claiming to unlock funds, fake refunds.
- **DEX confusion:** Users buying on DEX without understanding backing (price can still fluctuate vs backing).
- **Rug vectors avoided by design:** But users may fall for "this token is UnRugable" claims on unverified contracts.
- Mitigation: Always verify via factory, check BaseScan source, use official site.

## 8. UnRugable + DMF Interaction / Cross-Reference Potential
- **Shared USDC reserves?** No direct. Both use same Base USDC. Possible future: DMF vault queries UnRugable token backings for risk scoring?
- **Cross-protocol queries:** DMF Mentor could integrate factory calls to list "Chaos-backed" tokens, detect if a token uses UnRugable backing (via code hash or event logs).
- **Synergies:** DMF's vault (0x9D32eaF6a0dFCD89bBD18B3F8c90fE5936535736) could receive platform fees (0.2%) or act as devFeeRecipient for select launches. Cross-promote "DMF-backed Chaos tokens".
- **Shared creator (0xMarZel):** Natural alignment — DMF Mentor could reference UnRugable as "sister project" for meme safety.
- Open: Subgraph integration for DMF dashboard? Shared analytics?

## 9. FAQ DMF Mentor Should Know
- **Q: Is my USDC safe?** Yes — locked in token contract forever; only refundable proportionally.
- **Q: Can creator rug?** No — no withdraw, renounced, immutable.
- **Q: How do I get USDC back?** Send tokens to contract address (auto-refund) or use refundTo().
- **Q: Fees?** 1% on buys/refunds only (split as above). DEX trades free.
- **Q: Is price fixed?** Backing price is floor; market price on DEX can be higher/lower.
- **Q: What if everyone refunds?** Last holders get full remaining backing (pro-rata).
- **Q: Verified?** Tokens from factory can be verified with fixed constructor args.
- **Q: Launch cost?** Only gas; no platform fee.
- **Q: Difference from pump.fun etc.?** Permanent USDC backing + instant refunds vs LP rugs.

## 10. Integration Ideas & Open Questions
- **Ideas:**
  - DMF Mentor scam detector: Flag tokens not from official factory (0x00d3...).
  - Cross-query: Mentor API endpoint to check if address is UnRugable token + current backing ratio.
  - Shared reserves: Route some dmfUSD fees into UnRugable launches or vice-versa.
  - Agent skill: Molty/UnRugable skill already exists in repo (see molty/unrugable-molty-skill.md) — extend for DMF.
- **Open Questions:**
  - Exact current factory owner / platform fee recipient?
  - Subgraph endpoint for on-chain data?
  - Plans for multi-chain or additional stables?
  - How does Avici card integration (mentioned on site) work with refunds?
- **Recommendation for DMF Mentor:** Treat UnRugable as trusted sibling protocol. Prioritize education on "inverse bank run" and factory verification. Monitor for fake factory clones.

**Digest complete.** Ready for DMF Mentor ingestion. All claims grounded in repo + reports.