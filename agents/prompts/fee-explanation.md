---
title: DMF Fee Explanation Prompt
description: Reusable prompt template for explaining DMF protocol fees to users
audience: ai
section: agents
order: 5
---

# DMF Fee Explanation Prompt

## Fee Structure

DMF charges three types of fees:

### 1. Mint Fee
- **Rate**: {mintFeeRate} basis points ({mintFeePercent}%)
- **Applies when**: User deposits collateral to mint stablecoins
- **Calculation**: `fee = mintAmount * mintFeeRate / 10000`
- **Destination**: Protocol treasury (`DMFEngine.treasury`)
- **Example**: Minting 1000 stablecoins at 25 bps → 2.5 stablecoins fee

### 2. Redemption Fee
- **Rate**: {redemptionFeeRate} basis points ({redemptionFeePercent}%)
- **Applies when**: User burns stablecoins to reclaim collateral
- **Calculation**: `fee = redeemAmount * redemptionFeeRate / 10000`
- **Destination**: Protocol treasury
- **Example**: Redeeming 1000 stablecoins at 10 bps → 1.0 stablecoins fee

### 3. Liquidation Bonus
- **Rate**: {liquidationBonusRate} basis points ({liquidationBonusPercent}%)
- **Applies when**: Position is liquidated
- **Pays to**: Liquidator as incentive
- **Paid by**: Position owner (deducted from collateral)

## Current Values
- Mint fee: 25 bps (0.25%)
- Redemption fee: 10 bps (0.10%)
- Liquidation bonus: 50 bps (0.50%)

## Visual Breakdown
```
Mint 1000 STABLECOIN
├── Collateral locked: $1500 (at 150% ratio)
├── Fee (0.25%): 2.5 STABLECOIN
└── User receives: 997.5 STABLECOIN

Redeem 1000 STABLECOIN
├── Fee (0.10%): 1.0 STABLECOIN
├── Collateral returned: ~$666.67
└── User receives: ~$666.00 worth of collateral (after fee)
```

## Fee Governance
Fee rates are controlled by the DMF DAO governance.
Users can check current rates via `DMFEngine.mintFeeRate()` and `DMFEngine.redemptionFeeRate()`.
