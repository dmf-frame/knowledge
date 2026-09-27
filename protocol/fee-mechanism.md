---
title: Fee Mechanism
description: Deterministic 0.25% (capped at $20) buy and refund fee: formula, split, and worked examples.
audience: both
section: protocol
order: 3
---

# Fee Mechanism

DMF uses a deterministic fee model designed to keep accounting simple and strengthen backing over time.

## Variable Fee (Protocol Fee)

Applied to both buy (mint) and refund (burn) operations on Base.

- **Total fee**: 0.25% (25 bps) of the principal amount.
- **Cap**: $20.00 maximum per transaction.
- **Split**:
  - **0.15% (15 bps)** — backing-only fee. Retained as additional USDC backing in the contract. No extra dmfUSD is minted for this portion, which means the backing ratio increases over time.
  - **0.10% (10 bps)** — Operations fee. Paid according to the contract fee-recipient logic.

### Formula

```
totalFee = min(amount * totalFeeBps / 10000, maxVariableFeeUsdc)
devFee   = totalFee * DEV_FEE_BPS / TOTAL_FEE_BPS
backing  = totalFee - devFee
```

### Parameters

| Parameter | Value | Meaning |
|-----------|-------|---------|
| `totalFeeBps` | 25 | 0.25% total fee |
| `maxVariableFeeUsdc` | 20,000,000 | $20 max per transaction |
| `DEV_FEE_BPS` | 10 | 0.10% Operations portion, equal to 40% of the 0.25% total fee |

### Allocation

- **60%** of the total fee, equal to 0.15% of the transaction amount, stays in the contract as excess backing and increases the backing ratio.
- **40%** of the total fee, equal to 0.10% of the transaction amount, goes to Operations according to the contract fee-recipient logic.

## Cross-Chain Integration Notes

For direct buy/refund flows, the standard 0.25% variable fee, capped at $20, applies. Multi-chain route costs should be taken from live app/API quotes and described generically.

## Worked Examples

| Buy/Sell Amount | Fee (0.25%) | Capped? | Operations (40%) | Backing (60%) | Net Received |
|----------------|-------------|---------|------------------|---------------|--------------|
| $10 | $0.025 | No | $0.010 | $0.015 | 9.975 dmfUSD |
| $100 | $0.25 | No | $0.10 | $0.15 | 99.75 dmfUSD |
| $1,000 | $2.50 | No | $1.00 | $1.50 | 997.50 dmfUSD |
| $10,000 | $20.00 | Yes ($20 cap) | $8.00 | $12.00 | 9,980 dmfUSD |
| $100,000 | $20.00 | Yes ($20 cap) | $8.00 | $12.00 | 99,980 dmfUSD |

## Why This Matters

- The backing ratio is exactly 1.0 before the first buy (no supply, no reserve) and above 1.0 from the first buy onward: the 0.15% backing share stays in the contract as USDC, while the 0.10% operations share is minted as dmfUSD, so backing-per-token rises on every buy and every refund.
- As more users trade, the backing ratio increases.
- The $20 cap protects large transactors from disproportionate fees.
- Operations fees follow the contract fee-recipient logic, while the backing portion stays as USDC reserve. This split is a structural invariant verified by testing and formal verification.
