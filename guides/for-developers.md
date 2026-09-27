---
title: For Developers
description: Integration reference for dmfUSD: addresses, ABI surface, events, and buy/refund flows.
audience: both
section: guides
order: 2
---

# For Developers

This guide covers current public dmfUSD integration. dmfUSD is a Base-native ERC-20 with an ERC-4626-style **read-only** quote surface (`asset`, `totalAssets`, `convertTo*`, `preview*`, `max*`). Public integrations should use the direct `buy()` and `refund()` flows; `previewFees(principal)` returns the dev and backing fee split for any amount.

## Core Facts

- Chain: Base
- Decimals: 6, matching USDC
- Backing: live USDC balance of the dmfUSD contract
- Direct fee: 0.25%, capped at $20
- Fee split: 0.15% backing, 0.10% Operations
- No oracle, no debt, no liquidations

## Buy dmfUSD

```solidity
IERC20(USDC).approve(dmfUSDAddress, usdcAmount);
IDmfUSD(dmfUSDAddress).buy(usdcAmount);
```

## Refund dmfUSD

```solidity
IDmfUSD(dmfUSDAddress).refund(dmfAmount);
IDmfUSD(dmfUSDAddress).refundTo(receiverAddress, dmfAmount);
```

No extra approval is needed for refunds because the dmfUSD is burned from the caller balance.

## Events to Watch For

```solidity
event Buy(address indexed buyer, uint256 usdcIn, uint256 userTokensMinted, uint256 devCommissionDmfUsd, uint256 backingFeeUsdc);
event Refund(address indexed sender, address indexed recipient, uint256 tokensBurned, uint256 usdcOut, uint256 devCommissionDmfUsd, uint256 backingFeeUsdc);
```

## Common Errors

| Error | What Went Wrong |
|---|---|
| `InvalidAddress()` | Zero address supplied |
| `InvalidAmount()` | Zero amount supplied |
| `OnlyOwner()` | Non-owner tried an owner-only setup function |
| Revert on approve | Not enough USDC approved |
| Revert on buy | Amount too small after fee or insufficient USDC |
| Revert on refund | Insufficient dmfUSD balance or insufficient live reserves |

## Quick Reference

```text
dmfUSD (Base mainnet, chain ID 8453): 0x3a6f90b8517ff16b7a8c368f05f38bb03afd4aa7
USDC Base: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
dmfUSD decimals(): 6
```
