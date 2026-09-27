---
title: "System Architecture"
description: "Technical overview of DMF's architecture: smart contracts on Base, USDC integration, reserve management, and supply tracking."
audience: both
section: overview
date: 2026-09-29
---

# System Architecture

The DMF protocol runs on a single, immutable smart contract deployed on the Base blockchain. No frills, no confusing multi-contract setup — just a clean, simple design that does one thing well.

## The Smart Contract

DMF uses one main contract deployed on Base. This single contract does everything: holds the USDC reserves, mints and burns dmfUSD, and tracks the total supply. It's immutable — no upgrade buttons, no admin backdoors. All state changes happen through public functions that anyone can call.

The contract follows the ERC-20 standard for dmfUSD, which means it works out of the box with every wallet, exchange, and DeFi protocol on Base.

## How It Connects to USDC

USDC is the only thing backing dmfUSD. Here's how it works:

- **Buying**: USDC moves from your wallet to the contract via the standard `transferFrom` mechanism, and you receive dmfUSD.
- **Refunding**: You send dmfUSD back to the contract and USDC moves from the contract to your wallet.
- **While you hold dmfUSD**: The USDC just sits in the contract. No wrapping, no lending, no yield farming — it's just USDC, untouched.

No intermediate tokens. No wrapped assets. No yield-bearing derivatives. Pure, simple USDC.

## How Reserves Work

The contract maintains one USDC reserve pool. All deposited USDC stays put until someone refunds. The contract never lends, invests, or does anything fancy with the reserves. They're fully liquid at all times, which means every refund request can be satisfied immediately (you just pay your own gas).

The full-backing rule is enforced in code:

```
USDC Balance of Contract >= Total Supply of dmfUSD
```

This check runs on every buy and every refund. If it would ever be violated, the transaction simply reverts. No exceptions.

## Supply Tracking

The total dmfUSD supply is tracked through the standard ERC-20 `totalSupply` variable. Buying increases it, refunding decreases it. The only extra mint is the operations fee: 40% of the 0.25% buy/refund fee (0.10%) is minted as dmfUSD to the operations recipients (`DevCommissionMinted`, `_mintDevCommissionDmfUsd`). There is no admin mint, no rewards program, and no inflation beyond that fee split.

## Transaction Flow

Here's what happens under the hood:

1. **Buy** — You approve USDC spend → call `buy(usdcAmount)` → contract pulls USDC from you → creates dmfUSD and sends it to you → logs a Transfer event.
2. **Refund** — You call `refund(tokenAmount)` → contract burns your dmfUSD → sends you USDC → logs a Transfer event.
3. **Transfer** — Standard ERC-20 transfer of dmfUSD between wallets. Nothing special — just a regular token transfer.

The contract also exposes an ERC-4626-style **read-only quote** surface (`asset()`, `totalAssets()`, `convertToShares`, `convertToAssets`, and the `preview*` / `max*` helpers) for integrators. It is not an ERC-4626 implementation — there is no `deposit()`, `mint()`, `withdraw()` or `redeem()`. The state-changing entry points are `buy()` and `refund()`.

## Key Properties at a Glance

- **No admin powers over funds**: Once deployed, nothing can mint, freeze, pause, or upgrade. An active owner can only set the two operations-fee recipients (`setDevFeeRecipients`).
- **No pause function**: Buying and refunding are always available, 24/7.
- **No blacklist**: All addresses are treated equally.
- **No oracles**: The contract doesn't need any external price feeds.
- **Minimal surface area**: The contract only has the functions needed for buy, refund, and ERC-20 compliance. Less code = fewer bugs.
