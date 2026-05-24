---
title: "What is DMF?"
description: "High-level overview of the Digital Monetary Framework, dmfUSD, and how the protocol works."
audience: both
section: "Overview"
date: 2025-05-19
---

# What is DMF?

The **Digital Monetary Framework (DMF)** is a protocol on the Base blockchain that issues **dmfUSD** — a digital dollar that's fully backed, non-custodial, and whose USDC collateral grows over time. No trust required, just math.

## So What Exactly is dmfUSD?

dmfUSD is not a stablecoin. It doesn't rely on a peg, an oracle, or any debt mechanism. Instead, every dmfUSD in circulation is backed by USDC locked in a smart contract, and the backing-per-token increases as the protocol collects fees.

Think of it as a token whose collateral cushion keeps building. When you buy dmfUSD, part of the fee stays in the contract as extra USDC reserves. When someone does a swap through the DMF app, a fraction of that fee also lands in the reserve. The result: the ratio of USDC to dmfUSD is always at least 1.0 and climbs over time.

## How It Works

The protocol does three things:

### 1. Mint
Deposit USDC into the DMF smart contract. The contract creates dmfUSD and sends it to your wallet, minus a 0.25% fee (capped at $20). 60% of that fee stays in the contract as additional USDC backing — it's never borrowed or lent out.

### 2. Hold
Your dmfUSD sits in your wallet. Send it, trade it, use it in DeFi — it's your token. Meanwhile, the USDC you deposited stays in the contract, untouched, unloaned, uninvested.

### 3. Redeem
Send your dmfUSD back to the contract and get USDC out. The contract burns the returned dmfUSD. The process is permissionless — no asking, no waiting, no gatekeepers.

## Full Backing (and Growing)

The DMF protocol maintains at least 100% collateralization at every moment. The total USDC in the contract must always equal or exceed the total dmfUSD supply. And because fees add USDC to the reserve without minting new dmfUSD, the backing ratio grows over time.

This isn't a promise — it's enforced by the contract's code and visible to anyone on a block explorer. No lending market to fail, no oracle to manipulate, no liquidation cascade.

## Non-Custodial

You stay in control. The DMF protocol never touches your private keys. When you deposit USDC and mint dmfUSD, that USDC is held by the smart contract — not by any company, admin, or third party.

## Built on Base

DMF runs on **Base**, the Ethereum Layer 2 blockchain from Coinbase. Low fees, fast confirmations, broad ecosystem compatibility. Every operation — minting, sending, redeeming — costs pennies in gas.

## Immutable Contracts

The DMF smart contracts have zero admin keys. No upgrade mechanisms. No pause buttons. Once deployed, the rules are permanent — not even the original developers can change them.

## In a Nutshell

DMF is built around one simple idea: a digital dollar backed by USDC, where the backing ratio grows over time through fee accumulation. Everything is transparent, verifiable, and unchangeable. No lending, no leverage, no trust — just code and math on Base.
