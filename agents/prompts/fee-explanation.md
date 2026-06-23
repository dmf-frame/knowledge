---
title: DMF Fee Explanation Prompt
description: Reusable prompt template for explaining current DMF fees to users
audience: ai
section: agents
order: 5
---

# DMF Fee Explanation Prompt

## Current Fee Structure

DMF has two separate fee contexts. Do not mix them.

## 1. Direct dmfUSD buy/refund on Base

- Total fee: 0.25% of the transaction amount.
- Cap: $20 maximum per transaction.
- Backing portion: 0.15% of the transaction amount, retained as USDC backing.
- Operations portion: 0.10% of the transaction amount.
- Split of total fee: 60% backing, 40% Operations.

Example:

```text
Buy/refund amount: 1,000 USDC
Total fee: 2.50 USDC equivalent
Backing portion: 1.50 USDC
Operations portion: 1.00 USDC equivalent
```

## 2. Multi-chain swap/support context

- DMF backing fee: 0.04% routed to dmfUSD backing.
- Route/provider costs vary by live route.
- Do not invent total route fees. Use the live app/API value.

## User-Facing Rules

- Use “Operations”.
- Do not say fees are claimed automatically.
- Do not describe dmfUSD as a stablecoin or peg.
- Do not mention liquidation, oracle, debt, or collateral-ratio fees.
