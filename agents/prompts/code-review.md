---
title: DMF Code Review Prompt
description: Reusable prompt template for code review of DMF smart contract interactions
audience: ai
section: agents
order: 7
---

# DMF Code Review Prompt

## Context
Review the following {codeType} that interacts with the DMF protocol. Evaluate correctness, efficiency, and adherence to DMF conventions.

## Code Review Checklist

### Mint Flow (DMFEngine.mint)
- [ ] Is `collateralType` validated against supported collateral list?
- [ ] Is `collateralAmount` checked against minimum deposit?
- [ ] Is `allowance` sufficient before calling `mint()`?
- [ ] Is the `minOut` parameter set to protect against slippage?
- [ ] Are events emitted for tracking?

### Redeem Flow (DMFEngine.redeem)
- [ ] Is the user's stablecoin balance checked before redemption?
- [ ] Is `amount` validated (> 0 and <= balance)?
- [ ] Is `collateralType` specified correctly for the output?
- [ ] Are partial redemptions handled correctly?

### Liquidation
- [ ] Is the position verified as liquidatable (`canLiquidate()`)?
- [ ] Is the profit calculation correct (repay amount vs collateral received)?
- [ ] Is gas cost included in profitability calculation?

### General Patterns
- [ ] Error handling: are all contract reverts caught?
- [ ] Gas optimization: are batched calls used where possible?
- [ ] Event listening: are filters properly scoped?
- [ ] Cleanup: are subscriptions/timers properly disposed?

## Batch Review (For multiple files)
Analyze the full call chain: {entryPoint} → {callee1} → {callee2}. Verify data flow consistency across all files.

## Output
Provide findings grouped by severity with line references. Include suggested fixes for each issue.
