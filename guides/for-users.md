---
title: For Users — Quickstart
description: Beginner walkthrough of buying, holding and refunding dmfUSD on Base.
audience: human
section: guides
order: 3
---

# User Quickstart Guide

Welcome! Here's how to start using dmfUSD — a fully-backed digital token on Base.

## What You'll Need

- A browser wallet extension that supports Base (MetaMask, Rabby, or any other EVM wallet extension)
- A little bit of ETH on Base to cover gas costs (pennies per transaction)
- USDC on Base to buy dmfUSD — if your USDC sits on another chain, bridge it to Base first (see Option 2)

## How to Get dmfUSD

### Option 1: Buy Direct (you already have USDC on Base)

1. Open [dmfam.org](https://dmfam.org) and connect your wallet in the buy/sell card.
2. Enter how much USDC you want to convert.
3. Approve USDC spending — one-time per session.
4. Confirm the transaction. You receive dmfUSD minus the 0.25% fee (capped at $20).

### Option 2: Your USDC is on another chain

dmfUSD exists on Base only — you cannot buy it directly from another chain. Bring USDC to Base first:

1. Go to the external Swap & Bridge service: [bridge.blockchainbridge.ai](https://bridge.blockchainbridge.ai/) (dmfam.org/swap-bridge redirects there). It opens and runs on its own site and is not operated by DMF.
2. Connect a wallet in that service's own widget, pick your source chain and token, and set USDC on Base as the destination.
3. Bridge the USDC to Base.
4. Buy dmfUSD with that USDC on dmfam.org (Option 1).

The service routes across 100+ chains and lists curated tokens only — stablecoins, blue-chip assets, and utility-grade tokens.

## How to Sell dmfUSD

1. Open [dmfam.org](https://dmfam.org) and switch the buy/sell card to the redeem direction.
2. Enter how much dmfUSD you want to refund.
3. Confirm the transaction — USDC lands in your wallet, minus the same 0.25% fee (capped at $20).
4. To end up on another chain, bridge that USDC with the external service above. dmfUSD itself is never bridged, and no wrapped or bridged dmfUSD exists anywhere.

## Fees at a Glance

- **Buy/Sell fee**: 0.25% of the transaction, capped at $20 per transaction — the split is 0.15% retained as USDC backing, 0.10% minted as dmfUSD for operations.
- **Transfers**: 0% — sending dmfUSD to another wallet is free.
- **No hidden fees**: every fee is on-chain and verifiable. What you see is what you get.

## Tips for a Smooth Experience

- Buying and selling run through the buy/sell card on dmfam.org. Talk to the contract directly only if you know what you're doing — `buy(usdcAmount)` and `refund(tokenAmount)` are the entry points.
- Keep a tiny bit of ETH on Base for gas — cents per transaction.
- dmfUSD is backed by USDC held in the contract. Verify the backing ratio yourself any time on BaseScan.
- Never share a seed phrase, and always check the contract address before approving anything.

## Want to Verify the Backing Yourself?

Anyone can do this — no special access needed:

1. Go to BaseScan and look up the dmfUSD contract: `0x3a6f90b8517ff16b7a8c368f05f38bb03afd4aa7`
2. Call `totalAssets()` — this shows total USDC reserves (live balance).
3. Call `totalSupply()` — this shows total dmfUSD in circulation.
4. Call `getBackingPerToken()` — this shows the exact USDC backing per dmfUSD.

Reserves stay at or above supply in USDC terms. That is a USDC ratio, not a guarantee of a fixed USD value.

## Need Help?

See [dmfam.org/support](https://dmfam.org/support) for the FAQ, the step-by-step swap guides, and the live support assistant.
