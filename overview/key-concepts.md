---
title: "Key Concepts"
description: "Explanations of the core concepts behind DMF: mint, redeem, USDC backing with growing ratio, on-chain reserves, immutable contracts, and non-custodial design."
audience: both
section: "Overview"
date: 2025-05-19
---

# Key Concepts

## Mint

Minting is how dmfUSD comes into existence. You send USDC to the DMF smart contract, and it issues dmfUSD to your wallet (minus a 0.25% fee, capped at $20). Anyone with USDC and a Base wallet can do it — no application, no approval, no questions asked. The math is simple and transparent. Your minted dmfUSD lands in your wallet, and your USDC gets locked in the contract's reserve.

## Redeem

Redeeming is the reverse: you send dmfUSD back to the contract and get USDC in return. The contract burns your dmfUSD (permanently removing it from circulation). Like minting, it's permissionless — any dmfUSD holder can do it at any time. A small redeem fee might be subtracted from the USDC you receive. The ability to always redeem is the core promise of the protocol, and it's baked into the code.

## USDC Backing (Always at Least 1:1, Growing Over Time)

Every dmfUSD in existence is backed by USDC held in the contract's reserve. The backing ratio starts at 1.0 at launch and increases over time as protocol fees accumulate — 60% of every buy/sell fee stays in the contract as additional USDC collateral, and 0.04% of every multi-chain swap also gets redirected to the reserve.

This isn't a marketing slogan — it's an invariant enforced by the smart contract. The total USDC balance must always equal or exceed the total dmfUSD supply. This rule prevents any possibility of undercollateralization. The protocol was deliberately designed without leverage, lending, or yield-generating schemes that could weaken this ratio.

## On-Chain Reserves

All reserves live on-chain in the DMF smart contract's USDC balance. No off-chain bank accounts, no custodians, no trusted third parties managing the money. Anyone can independently verify the reserves by checking the contract's USDC balance on BaseScan and comparing it to the dmfUSD total supply. No audits needed, no trust required — the proof is right there in the blockchain state.

## Immutable Contracts

The DMF smart contracts are frozen in time. Once deployed, nobody can change how they work. No admin keys, no upgrade proxies, no ownership functions, no pause mechanisms. This permanence means the protocol's rules are locked forever. Want to verify? Check the contract source on BaseScan — no upgradeable patterns, and the creator has renounced ownership. What you see is what you get, permanently.

## Non-Custodial

DMF is non-custodial through and through. You maintain full sovereignty over your assets at all times. When USDC goes into the contract, it's held by the smart contract itself — not by any company, team, or individual. Nobody can stop you from redeeming your dmfUSD. There's no KYC, no whitelist, no approval process. The protocol treats everyone equally and never plays gatekeeper. This design removes counterparty risk entirely — the only counterparty is the code.
