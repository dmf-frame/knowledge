---
title: "Understanding Fees"
description: "Simple explanation of how mint and redeem fees work in the DMF protocol."
audience: human
section: "Education"
date: 2025-05-19
---

# Understanding Fees

The DMF protocol charges small fees when you mint or redeem dmfUSD. Let's break down what they are, why they exist, and how they work — in plain English.

## Why Fees at All?

Good question. These fees cover the real costs of running the protocol:

- Smart contract development and professional security audits
- Ongoing monitoring to keep things safe
- Infrastructure like RPC endpoints and hosting
- Future development and growing the ecosystem

The key word here is **small**. Fees are intentionally kept low so dmfUSD is practical for everyday use — not a tax, just a tiny cost of doing business.

## The Mint Fee

When you deposit USDC to mint dmfUSD, a small fee comes out of your deposited USDC before the dmfUSD is created.

**Example**: Say the mint fee is 0.1% and you deposit 1,000 USDC:
- Fee: 1 USDC
- Goes into reserves: 999 USDC
- You receive: 999 dmfUSD

The fee comes out of the USDC you deposited, so the amount of dmfUSD you get equals what's left after the fee. This keeps the 1:1 backing ratio rock solid.

## The Redeem Fee

When you cash out dmfUSD back to USDC, a small fee comes out of the USDC you receive.

**Example**: Say the redeem fee is 0.1% and you redeem 1,000 dmfUSD:
- dmfUSD burned: 1,000
- Fee: 1 USDC
- You get back: 999 USDC

Notice the fee comes out of the USDC withdrawal, not the dmfUSD you're burning. The contract keeps that fee USDC as part of its reserves.

## Where Does the Fee Money Go?

All the USDC collected from fees stays in the contract's USDC balance. That means it becomes part of the reserve backing every remaining dmfUSD token. Some of it may be used for development and operations, depending on how the protocol's governance is set up.

Because the contract is immutable (no upgrades, no changes), the fee logic is locked in at deployment. The rates can't be changed after the fact — what you see is what you get, forever.

## Total Transparency

Every fee is visible on-chain. When you call the mint or redeem function, the fee is calculated the same way every time, and it's right there in the transaction data. You can see exactly how much was deducted by checking the transaction on BaseScan.

The contract also has read functions that let you check the current fee rates before you do anything — no surprises.

## Quick Summary

| Operation | Fee | Taken From |
|---|---|---|
| Mint dmfUSD | Small % (e.g. 0.1%) | Your deposited USDC |
| Redeem USDC | Small % (e.g. 0.1%) | Your returned USDC |
| Transfer dmfUSD | Free | — |

Fees are transparent, predictable, and locked in forever. They're designed to be low enough for daily use while keeping the protocol sustainable.
