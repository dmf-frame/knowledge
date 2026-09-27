---
title: "Understanding Fees"
description: "Simple explanation of how buy and refund fees work in the DMF protocol."
audience: human
section: education
date: 2026-09-28
---

# Understanding Fees

The DMF protocol charges small fees when you buy or refund dmfUSD. Let's break down what they are, why they exist, and how they work — in plain English.

## Why Fees at All?

Good question. These fees cover the real costs of running the protocol:

- Smart contract development and in-house security testing
- Ongoing monitoring to keep things safe
- Infrastructure like RPC endpoints and hosting
- Future development and growing the ecosystem

The key word here is **small**. Fees are intentionally kept low so dmfUSD is practical for everyday use — not a tax, just a tiny cost of doing business.

## The Buy Fee

When you deposit USDC to buy dmfUSD, a small fee comes out of your deposited USDC before the dmfUSD is created.

**Example**: Say the buy fee is 0.25% and you deposit 1,000 USDC:
- Full 1,000 USDC enters the contract
- Fee: 2.50 USDC (0.25%)
- You receive: 997.50 dmfUSD
- Operations mint: 1.00 dmfUSD (0.10% of the deposit)
- Unminted backing: 1.50 USDC (0.15%) stays in the contract automatically

The full USDC deposit sits in the contract. You receive fewer dmfUSD than USDC deposited, and the operations share is minted as dmfUSD. The unmatched USDC is extra backing.

## The Refund Fee

When you cash out dmfUSD back to USDC, a small fee comes out of the USDC you receive.

**Example**: Say the refund fee is 0.25% and you refund 1,000 dmfUSD:
- dmfUSD burned: 1,000
- Fee: 2.50 USDC
- You get back: 997.50 USDC

Notice the fee comes out of the USDC withdrawal, not the dmfUSD you're burning. The contract keeps that fee USDC as part of its reserves.

## Where Does the Fee Money Go?

The 0.15% backing portion remains in the contract as USDC automatically on each `buy()` / `refund()` — there is no separate claim step for that USDC. The 0.10% operations portion is minted as dmfUSD to the two fee recipients (`DevCommissionMinted`). Recipients hold dmfUSD; they are not paid USDC from the reserve.

Because the contract is immutable (no upgrades, no changes), the fee logic is locked in at deployment. The rates can't be changed after the fact — what you see is what you get, forever.

## Total Transparency

Every fee is visible on-chain. When you call the buy or refund function, the fee is calculated the same way every time, and it's right there in the transaction data. You can see exactly how much was deducted by checking the transaction on BaseScan.

The contract also has read functions that let you check the current fee rates before you do anything — no surprises.

## Quick Summary

| Operation | Fee | Taken From |
|---|---|---|
| Buy dmfUSD | 0.25% (25 bps), capped at $20 | Your deposited USDC |
| Refund to USDC | 0.25% (25 bps), capped at $20 | Your returned USDC |
| Transfer dmfUSD | Free | — |

Fees are transparent, predictable, and locked in forever. They're designed to be low enough for daily use while keeping the protocol sustainable.
