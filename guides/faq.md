---
title: Frequently Asked Questions
description: Protocol FAQ: backing, fees, security testing, and how to buy or refund dmfUSD.
audience: both
section: guides
order: 1
---

# Frequently Asked Questions

## 1. What is dmfUSD?

dmfUSD is a fully-backed digital token on the Base blockchain. Unlike a stablecoin — which relies on a peg mechanism, an oracle, or debt — dmfUSD is backed by USDC sitting in an on-chain reserve, and the backing-per-token grows over time as protocol fees accumulate. Every time someone buys or sells dmfUSD, 60% of the fee stays in the contract as additional USDC backing.

## 2. Is dmfUSD safe?

Short answer: we've put it through the wringer. Long answer: the contract has passed 60 tests (24 unit + 12 economic scenario + 16 fuzz + 8 invariant) with zero failures — including 104M+ executed contract operations — plus 10 Certora Prover checks and Slither and Aderyn static analysis with zero high-severity findings. The contract has no admin mint function, no freeze button, and no pause mechanism. That said, dmfUSD depends on USDC and Base — if either of those have problems, dmfUSD could be affected too.

## 3. How do I buy dmfUSD?

Approve the contract to spend your USDC (one-time approval), then call `buy(usdcAmount)`. On dmfam.org the buy/sell card does the same thing through a wallet connection, with a preview before you confirm. If your USDC is on another chain, bridge it to Base first with the external Swap & Bridge service (BlockchainBridge, https://bridge.blockchainbridge.ai/) — it routes across 100+ chains and lists curated tokens only (stablecoins, blue-chip and utility-grade assets, no meme coins). dmfUSD itself exists on Base only.

## 4. What are the fees?

A 0.25% fee (25 basis points) applies to both buying and selling dmfUSD, capped at $20 per transaction. Of that, 60% (0.15%) stays in the contract as additional USDC backing — this is what makes the backing-per-token grow over time. The remaining 40% (0.10%) is minted as dmfUSD for operational costs. Swap and bridge runs on BlockchainBridge (https://bridge.blockchainbridge.ai/), an external service that is not operated by DMF. A share of its swap and bridge fee income is donated to the dmfUSD contract as USDC, which raises backing-per-token. That donation rate is set by BlockchainBridge and is not published.

## 5. Is dmfUSD audited?

There has been no traditional manual audit by an external audit firm — verification is in-house and automated. The contract is tested with Foundry — 60 tests (24 unit + 12 economic scenario + 16 fuzz + 8 invariant), zero failures, including 104M+ executed contract operations — formally verified with the Certora Prover (10 checks, math and system rule sets), and analyzed with Slither (Trail of Bits) and Aderyn (Cyfrin) with zero high-severity findings.

## 6. Can I lose money?

dmfUSD is backed by USDC, and the backing cushion grows over time through fee accumulation: because every buy and every refund leaves part of the fee in the contract as extra USDC, reserves stay at or above supply in USDC terms. That backing is denominated in USDC, not USD — dmfUSD has no fixed USD peg, so if USDC loses its dollar peg, the USD value of dmfUSD would move with it. The real risks are: USDC losing its peg, a smart contract vulnerability (extremely unlikely given the testing), or Base going down.

## 7. How do I verify the backing?

Head to BaseScan, look up the dmfUSD contract, and call `totalAssets()` (total USDC reserves — live balance) and `totalSupply()` (total dmfUSD in circulation). Reserves stay at or above supply in USDC terms. You can also check `getBackingPerToken()` for the exact ratio.

## 8. Can I use dmfUSD in DeFi?

Yes. dmfUSD is a standard ERC-20 token (6 decimals, matching USDC), so any DeFi protocol that accepts ERC-20 tokens can hold it. It also exposes an ERC-4626-style **read-only quote** surface for integrators — `asset()`, `totalAssets()`, `convertToShares()`, `convertToAssets()`, and the `preview*` / `max*` helpers. It is **not** an ERC-4626 implementation: there are no `deposit()`, `mint()`, `withdraw()` or `redeem()` functions, so vault-style integrations must use `buy()` and `refund()` as the state-changing entry points.

## 9. How does cross-chain work?

dmfUSD lives on Base only — it is never bridged or wrapped, so no bridged or wrapped dmfUSD exists on any other chain. To acquire it from another chain, bridge your USDC to Base with the external Swap & Bridge service (BlockchainBridge, https://bridge.blockchainbridge.ai/), then buy dmfUSD with that USDC on Base. To leave Base, refund dmfUSD to USDC on Base first, then bridge that USDC to your destination chain with the same service.

## 10. Is dmfUSD permissionless?

Yes. Anyone with USDC can call `buy()` to get dmfUSD — no KYC, no whitelist, no asking for permission. The core contract is open to everyone.

## 11. What's the backing ratio?

It's the total USDC reserves divided by the total dmfUSD supply. Because the backing share of every fee (60% of the 0.25%, i.e. 0.15%) is added to the reserve as USDC without minting new dmfUSD, while only the operations share (40%, 0.10%) is minted as dmfUSD, the ratio stays at or above 100% in USDC terms and grows over time as more people use the protocol. It is a USDC ratio, not a guarantee of a fixed USD value.

## 12. Can the admin mint unlimited dmfUSD?

Nope. There's no admin mint function at all. The normal public way to create dmfUSD is through `buy()`. This is a structural invariant verified by Certora — it's mathematically guaranteed.

## 13. What chains are supported?

dmfUSD is native to Base mainnet (chain ID 8453) — that is its only deployment, and there is no testnet version to interact with. The external BlockchainBridge swap and bridge service routes transactions across 100+ chains, but those are routes, not dmfUSD deployments.

## 14. How do I add dmfUSD to my wallet?

Use the dmfUSD contract address `0x3a6f90b8517ff16b7a8c368f05f38bb03afd4aa7` on Base mainnet. Most wallets will auto-detect the token symbol and decimals (6); you can also import it manually using the contract address.

## 15. What happens if Circle freezes USDC in the contract?

If Circle freezes the USDC held by the dmfUSD contract, redemptions would be blocked until the freeze is lifted. This is a risk that comes with any USDC-based token. DMF uses native USDC (not bridged) to minimize extra intermediary risk.
