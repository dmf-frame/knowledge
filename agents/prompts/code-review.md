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

## DMF Contract Ground Truth (Never Contradict)

The dmfUSD contract (`app/dmftokens/dmfUSD.sol` in DMF-org, Base mainnet chain 8453) is:
- An ERC-20 token with an ERC-4626-style **read-only** quote surface. It is NOT an ERC-4626 vault: `deposit()`, `mint()`, `withdraw()` and `redeem()` do not exist. Buy = `buy(uint256 usdcAmount)`, refund = `refund(uint256 tokenAmount)` / `refundTo(address recipient, uint256 tokenAmount)`.
- Backing: live `USDC.balanceOf(address(this))` — no separate reserve accounting variable.
- Direct fee: 0.25% capped at $20 (`TOTAL_FEE_BPS = 25n`, `MAX_VARIABLE_FEE_USDC = 20_000_000n`). Split: 60% (0.15%) retained as USDC backing, 40% (0.10%) minted as dmfUSD for operations.
- NO oracles, NO liquidation, NO collateral types, NO debt positions, NO CDP mechanics.
- Non-custodial, immutable, no admin keys. Owner has only standard Ownable2Step admin duties.
- `getBackingPerToken()` = USDC balance / totalSupply — always >= 1.0, grows over time.

There is no `DMFEngine`, `DMFVault`, `DMFOracle`, `collateralType`, or `canLiquidate()` in the protocol. Reviews describing those concepts are reviewing a different, non-existent system.

## Code Review Checklist

### Buy / Mint Flow (`buy(uint256 usdcAmount)`)
- [ ] Is `allowance` sufficient before calling `buy()`?
- [ ] Is `usdcAmount` validated (> 0 and <= user's USDC balance)?
- [ ] Is the min-out / slippage protection (if any) correctly derived from `previewFees` / `previewDeposit`?
- [ ] Are events emitted for tracking?

### Refund / Redeem Flow (`refund(uint256)` / `refundTo(address, uint256)`)
- [ ] Is `tokenAmount` validated (> 0 and <= user's dmfUSD balance)?
- [ ] Is the correct ERC-20 approval/permit path used if the caller is not the holder?
- [ ] Are partial redemptions handled correctly (no dust loss, no rounding exploit)?
- [ ] Does the code account for the fee deducted from the USDC returned (`previewWithdraw` / `previewRedeem`)?

### Backing & Reserves
- [ ] Does the code read backing from `USDC.balanceOf(address(this))` (or `totalAssets()`) rather than a cached reserve variable?
- [ ] Is `getBackingPerToken()` used correctly (>= 1.0, growing, not a peg claim)?

### General Patterns
- [ ] Error handling: are all contract reverts caught?
- [ ] Gas optimization: are batched calls used where possible?
- [ ] Event listening: are filters properly scoped?
- [ ] Cleanup: are subscriptions/timers properly disposed?
- [ ] Address handling: is the dmfUSD address taken from config, never hardcoded inline?
- [ ] Does the code avoid claiming dmfUSD is a stablecoin, pegged, or liquidatable?

## Batch Review (For multiple files)
Analyze the full call chain: {entryPoint} → {callee1} → {callee2}. Verify data flow consistency across all files.

## Output
Provide findings grouped by severity with line references. Include suggested fixes for each issue.
