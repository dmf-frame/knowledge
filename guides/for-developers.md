# For Developers

This guide covers current public dmfUSD integration. dmfUSD is a Base-native ERC-20 with a compatible vault surface for internal routing integrations, but public integrations should focus on direct `buy()` and `refund()` flows unless the current contract ABI requires otherwise.

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
event Buy(address indexed buyer, uint256 usdcIn, uint256 tokensMinted, uint256 operationsFeeUsdc, uint256 backingFeeUsdc);
event Refund(address indexed sender, address indexed recipient, uint256 tokensBurned, uint256 usdcOut, uint256 operationsFeeUsdc, uint256 backingFeeUsdc);
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
dmfUSD chain: Base, chain ID 8453
USDC Base: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
dmfUSD decimals: 6
```
