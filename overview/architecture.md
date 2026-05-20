---
title: "System Architecture"
description: "Technical overview of DMF's architecture: smart contracts on Base, USDC integration, reserve management, and supply tracking."
audience: both
section: "Overview"
date: 2025-05-19
---

# System Architecture

The DMF protocol runs on a single, audited smart contract deployed on the Base blockchain. No frills, no confusing multi-contract spaghetti — just a clean, simple design that does one thing well.

## The Smart Contract

DMF uses one main contract deployed on Base. This single contract does everything: holds the USDC reserves, mints and burns dmfUSD, and tracks the total supply. It's immutable — no upgrade buttons, no admin backdoors. All state changes happen through public functions that anyone can call.

The contract follows the ERC-20 standard for dmfUSD, which means it works out of the box with every wallet, exchange, and DeFi protocol on Base.

## How It Connects to USDC

USDC is the only thing backing dmfUSD. Here's how it works:

- **Minting**: USDC moves from your wallet to the contract via the standard `transferFrom` mechanism.
- **Redeeming**: USDC moves from the contract back to your wallet.
- **While you hold dmfUSD**: The USDC just sits in the contract. No wrapping, no lending, no yield farming — it's just USDC, untouched.

No intermediate tokens. No wrapped assets. No yield-bearing derivatives. Pure, simple USDC.

## How Reserves Work

The contract maintains one USDC reserve pool. All deposited USDC stays put until someone redeems. The contract never lends, invests, or does anything fancy with the reserves. They're fully liquid at all times, which means every redemption request can be satisfied immediately (you just pay your own gas).

The 1:1 backing rule is enforced in code:

```
USDC Balance of Contract >= Total Supply of dmfUSD
```

This check runs on every mint and every redeem. If it would ever be violated, the transaction simply reverts. No exceptions.

## Supply Tracking

The total dmfUSD supply is tracked through the standard ERC-20 `totalSupply` variable. Simple pattern: minting increases it, redeeming decreases it. The contract never mints or burns dmfUSD for any other reason — no rewards, no distributions, no inflation. Just user-initiated operations.

## Transaction Flow

Here's what happens under the hood:

1. **Mint** — You approve USDC spend → call `mint(amount)` → contract pulls USDC from you → creates dmfUSD and sends it to you → logs a Mint event.
2. **Redeem** — You call `redeem(amount)` → contract burns your dmfUSD → sends you USDC → logs a Redeem event.
3. **Transfer** — Standard ERC-20 transfer of dmfUSD between wallets. Nothing special — just a regular token transfer.

## Key Properties at a Glance

- **No admin keys**: Once deployed, nobody can change anything.
- **No pause function**: Minting and redeeming are always available, 24/7.
- **No blacklist**: All addresses are treated equally.
- **No oracles**: The contract doesn't need any external price feeds.
- **Minimal surface area**: The contract only has the functions needed for mint, redeem, and ERC-20 compliance. Less code = fewer bugs.
