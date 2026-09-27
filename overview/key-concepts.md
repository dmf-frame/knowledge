---
title: "Key Concepts"
description: "Explanations of the core concepts behind DMF: buy, refund, USDC backing with growing ratio, on-chain reserves, immutable contracts, and non-custodial design."
audience: both
section: overview
date: 2026-09-27
---

# Key Concepts

## Buy

Buying is how dmfUSD comes into existence. You send USDC to the DMF smart contract via `buy(usdcAmount)`, and it issues dmfUSD to your wallet (minus a 0.25% fee, capped at $20). Anyone with USDC and a Base wallet can do it — no application, no approval, no questions asked. The math is straightforward. Your dmfUSD lands in your wallet, and your USDC gets locked in the contract's reserve.

## Refund

Refunding is the reverse: you send dmfUSD back to the contract via `refund(tokenAmount)` and get USDC in return. The contract burns your dmfUSD (permanently removing it from circulation). Like buying, it's permissionless — any dmfUSD holder can do it at any time. The same 0.25% fee (capped at $20) is subtracted from the USDC you receive — never a variable or discretionary amount. The ability to always refund is the core promise of the protocol, and it's baked into the code.

## USDC Backing (Always at Least 1:1, Growing Over Time)

Every dmfUSD in existence is backed by USDC held in the contract's reserve. The backing ratio starts at 1.0 at launch and increases over time as protocol fees accumulate — 60% of every buy/sell fee stays in the contract as additional USDC collateral, and a share of the external BlockchainBridge swap and bridge service's fee income is also donated to the reserve.

This isn't a marketing slogan — it's an invariant enforced by the smart contract. The total USDC balance must always equal or exceed the total dmfUSD supply. This rule prevents any possibility of undercollateralization. The protocol was deliberately designed without leverage, lending, or yield-generating schemes that could weaken this ratio.

## On-Chain Reserves

All reserves live on-chain in the DMF smart contract's USDC balance. No off-chain bank accounts, no custodians, no trusted third parties managing the money. Anyone can independently verify the reserves by checking the contract's USDC balance on BaseScan and comparing it to the dmfUSD total supply. No external attestation is needed — the proof is right there in the blockchain state. Verification is in-house and automated; see the Security section.

## Immutable Contracts

The DMF smart contracts are frozen in time. Once deployed, the fee rates, backing rules, and user entry points cannot be changed. There is no upgrade proxy, no pause, no freeze, and no admin mint. An Ownable2Step owner remains and can only call `setDevFeeRecipients` to update the two operations-fee recipients and the split between them. Ownership is not renounced. Want to verify? Check the contract source on BaseScan — no upgradeable patterns. What you see is what you get, permanently.

## Non-Custodial

DMF is non-custodial through and through. You hold your dmfUSD in your own wallet, and the USDC reserve is held by the smart contract itself — not by any company, team, or individual. There's no KYC, no whitelist, no approval process, and no DMF key that can freeze your balance, block a refund, or move the reserve. The protocol treats everyone equally and never plays gatekeeper. The dependencies that remain are the ones every on-chain asset has: the Base network and the USDC issuer, which can blacklist an address at the USDC token contract. Inside DMF there is no issuer, admin, or counterparty that can refuse to pay you — the code is the only counterparty.
