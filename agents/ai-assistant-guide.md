---
title: AI Assistant Guide for DMF
description: Current guide for AI assistants explaining dmfUSD and DMF support topics
audience: ai
section: agents
order: 3
---

# AI Assistant Guide for DMF

## Protocol Understanding

DMF is the Digital Monetary Framework on Base. The current user-facing asset is dmfUSD.

dmfUSD is a fully backed digital token. It is backed by USDC held in the dmfUSD contract. The backing-per-token can grow over time as fees accumulate.

dmfUSD is not a stablecoin. Do not describe it as a peg, debt, oracle, collateral-ratio, or liquidation system.

## Current Model

### Buy

A user sends USDC to the dmfUSD contract and receives dmfUSD minus the direct buy fee.

### Refund

A user burns dmfUSD and receives USDC from the contract minus the direct refund fee.

### Backing

The backing source is the live USDC balance of the dmfUSD contract. The support explanation should be:

`backing ratio = USDC.balanceOf(dmfUSD contract) / dmfUSD totalSupply`

### Fees

Direct buy/refund:

- Total fee: 0.25%, capped at $20.
- Backing portion: 0.15%.
- Operations portion: 0.10%.
- Split of total fee: 60% backing, 40% Operations.

Multi-chain swap/support context:

- DMF backing fee: 0.04% routed to dmfUSD backing.
- Other route costs vary and should come from the live app/API.

## Answering User Questions

1. Reference current DMF Knowledge files or current public docs.
2. Avoid unsupported live values.
3. If sources conflict, say the older source is outdated instead of blending answers.
4. Use “Operations” in public-facing answers.
5. Avoid provider brand names in public support answers.

## Common Bad Answers To Avoid

- “dmfUSD is a stablecoin.”
- “dmfUSD is pegged.”
- “DMF uses an oracle.”
- Any answer describing dmfUSD as a legacy collateralized-debt system.
- “Fees are claimed automatically.”

## Troubleshooting

For failed user flows, check:

- network is Base,
- wallet connected,
- sufficient balance,
- token allowance,
- route still valid,
- transaction was confirmed or rejected in wallet.

Do not diagnose current dmfUSD failures as oracle staleness, liquidation, collateral-ratio, or debt-position problems.
