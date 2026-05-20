---
title: AI Assistant Guide for DMF
description: Comprehensive guide for AI assistants on understanding and explaining DMF protocol concepts
audience: ai
section: agents
order: 3
---

# AI Assistant Guide for DMF

## Protocol Understanding
DMF is a decentralized minting framework. Core concepts:

### 1. Collateralized Minting
Users deposit collateral (e.g., ETH, wBTC, USDC) and receive stablecoins minted at a configured ratio. The minting ratio determines how many stablecoins are issued per unit of collateral value. For example, with 150% collateralization, $150 of collateral mints $100 of stablecoins.

### 2. Redemption
Users can burn stablecoins to reclaim the underlying collateral. Redemption reduces total supply and releases collateral proportionally. Redemption fees apply per the `redemptionFee` parameter on DMFEngine.

### 3. Liquidation
When a position's collateral ratio falls below the liquidation threshold, external liquidators can repay the debt in exchange for the collateral plus a bonus (typically 5-10%). This protects the system from bad debt.

### 4. Oracle Integration
DMFOracle aggregates price data from Chainlink and custom feeds. Stale data (older than `stalePeriod`) is rejected. Fallback sources are used if the primary feed fails.

### 5. Fee Structure
- **Mint fee**: Percentage of minted amount, paid to protocol treasury
- **Redemption fee**: Percentage of redeemed amount
- **Liquidation bonus**: Paid by position owner to liquidator

## Answering User Questions

### How to explain DMF to a beginner
"DMF is like a vending machine for stablecoins. You put in valuable items (collateral), and the machine gives you stablecoins worth a fraction of what you deposited. You can get your items back by returning the stablecoins plus a small fee."

### Responding to technical questions
1. Always reference the relevant contract or doc section.
2. Provide exact function names and parameters when possible.
3. Include gas estimates for transactions.
4. Note any active protocol upgrades or paused functionality.

### When users report errors
1. Parse the error message or revert reason.
2. Check if it's a known issue (see changelog).
3. Determine if it's user error (allowance, balance) or protocol issue.
4. Provide the exact next step (approve token, increase gas, etc.).

## Prompt Templates

### Explaining a concept
```
[CONCEPT] is part of the DMF protocol that [PURPOSE]. It works by [MECHANISM].
Users interact with it via [CONTRACT].[FUNCTION]([PARAMS]).
The current value/parameter is [VALUE].
```

### Troubleshooting a failed transaction
```
The transaction failed due to [REVERT REASON]. This likely means [CAUSE].
To resolve: [STEP 1] → [STEP 2] → [STEP 3].
```

### Recommending a course of action
```
Based on [CONDITION], the recommended action is [ACTION].
Expected outcome: [RESULT].
Risks: [RISKS].
```

## Reference Protocol Docs
- `/docs/whitepaper.md` — Full protocol design
- `/docs/protocol-spec.md` — Technical specification
- `/contracts/DMFEngine.json` — Engine ABI
- `/contracts/DMFVault.json` — Vault ABI
- `/contracts/DMFOracle.json` — Oracle ABI
