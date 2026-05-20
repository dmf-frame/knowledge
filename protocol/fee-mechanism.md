# Fee Mechanism

DMF uses a deterministic fee model designed to keep accounting simple and strengthen backing over time.

## Variable Fee (Protocol Fee)

Applied to both buy (mint) and refund (burn) operations on Base.

- **Total fee**: 0.25% (25 bps) of the principal amount.
- **Cap**: $20.00 maximum per transaction.
- **Split**:
  - **0.15% (15 bps)** — backing-only fee. Retained as additional USDC backing in the contract. No extra dmfUSD is minted for this portion, which means the backing ratio increases over time.
  - **0.10% (10 bps)** — developer fee. Paid in dmfUSD (not USDC) to the developer wallet address.

### Formula

```
totalFee = min(amount * totalFeeBps / 10000, maxVariableFeeUsdc)
devFee   = totalFee * devFeeFraction / 10000
backing  = totalFee - devFee
```

### Parameters

| Parameter | Value | Meaning |
|-----------|-------|---------|
| `totalFeeBps` | 25 | 0.25% total fee |
| `maxVariableFeeUsdc` | 20,000,000 | $20 max per transaction |
| `devFeeFraction` | 1,000 | 10% of fee goes to dev wallet |

### Allocation

- **90%** of collected fees → stays in the contract as excess backing (benefits all dmfUSD holders by increasing the backing ratio).
- **10%** → sent to `_devWalletAddress` in dmfUSD (not USDC).

## Cross-Chain Integration Notes

For cross-chain deposits, the LiFi Composer handles bridging and swaps. There is no separate CCTP service fee — the standard 0.25% variable fee (capped at $20) applies to all minting and burning operations regardless of whether they originate from a direct call or a cross-chain flow.

## Worked Examples

| Buy/Sell Amount | Fee (0.25%) | Capped? | Dev Fee (10%) | Backing (90%) | Net Received |
|----------------|-------------|---------|---------------|---------------|--------------|
| $10 | $0.025 | No | $0.0025 | $0.0225 | 9.975 dmfUSD |
| $100 | $0.25 | No | $0.025 | $0.225 | 99.75 dmfUSD |
| $1,000 | $2.50 | No | $0.25 | $2.25 | 997.50 dmfUSD |
| $10,000 | $20.00 | Yes ($20 cap) | $2.00 | $18.00 | 9,980 dmfUSD |
| $100,000 | $20.00 | Yes ($20 cap) | $2.00 | $18.00 | 99,980 dmfUSD |

## Why This Matters

- The backing ratio is always > 100% from day one because fees add excess reserves without minting extra tokens.
- As more users trade, the backing ratio increases — the system gets stronger with usage.
- The $20 cap protects large transactors from disproportionate fees.
- Dev fees are paid in dmfUSD, never USDC, which is a structural invariant verified by formal verification.
