---
title: Smart Contract Architecture
description: Single-contract design of dmfUSD: ERC-20 core, read-only quote surface, and access control.
audience: both
section: protocol
order: 2
---

# Smart Contract Architecture

## Overview

The DMF protocol on Base consists of a single core token contract (`dmfUSD`). The system is designed to be minimal, auditable, and composable.

## dmfUSD — The Core Token

`dmfUSD.sol` is the central contract. It holds USDC reserves, mints dmfUSD on buy, burns it on refund, and enforces the fee model. It inherits from standard OpenZeppelin contracts:

```
dmfUSD
  ├── ERC20 (OpenZeppelin)       → name, symbol, totalSupply, balanceOf, transfer
  ├── ERC20Permit (OZ)           → permit() for gasless approvals
  ├── ReentrancyGuard (OZ)       → nonReentrant on buy/refund
  └── Ownable2Step (OZ)          → 2-step ownership transfer
```

### Key Design Decisions

- **Decimals = 6** — matches USDC, eliminating decimal conversion errors.
- **No tracked `usdcReserves` variable** — backing is `USDC.balanceOf(address(this))` live. The source says it in as many words: `// No separate reserve accounting — balanceOf(this) IS the reserve.` Any USDC sent straight to the contract instantly counts as backing.
- **No admin mint/freeze/pause** — and no privileged entrypoint of any kind. There is no admin mint function, no freeze mechanism, no pause, and no route or router role: outside Ownable2Step's `transferOwnership()`, the only owner-only function is `setDevFeeRecipients()`.

### Primary User Functions

- `buy(usdcAmount)` — User deposits USDC and receives newly minted dmfUSD. Anyone can call this.
- `refund(tokenAmount)` — User burns dmfUSD and receives USDC back. Anyone can call this.
- `refundTo(recipient, tokenAmount)` — Burn dmfUSD and send USDC to a chosen EVM recipient.

### No Privileged Routing Functions

- There are no route-only or router-gated entrypoints. Users — and any integration — go through the same public flows: `buy()`, `refund()`, `refundTo()`.

### ERC-4626-style Read-Only Surface

The contract does **not** implement the ERC-4626 interface and has no vault deposit/redeem functions. It exposes an ERC-4626-style **read-only quote** surface so integrators can price dmfUSD the way they price a vault:

- View functions: `asset()` returns the USDC address, `totalAssets()` returns `USDC.balanceOf(address(this))`, `getBackingPerToken()` returns the USDC backing per dmfUSD.
- Quote helpers: `previewDeposit`, `previewRedeem`, `previewMint`, `previewWithdraw`, `convertToShares`, `convertToAssets`, `maxDeposit`, `maxRedeem`, `maxWithdraw`, `maxMint`.
- There are **no** `deposit()`, `mint()`, `withdraw()` or `redeem()` functions on the deployed contract. Verified on-chain 2026-09-27: those selectors revert. The state-changing entry points are `buy(usdcAmount)` and `refund(tokenAmount)` / `refundTo(recipient, tokenAmount)`.

### Access Control

| Function | Guard | Who Can Call |
|----------|-------|-------------|
| `buy()` | nonReentrant | Anyone |
| `refund()` / `refundTo()` | nonReentrant | Anyone |
| `setDevFeeRecipients()` | onlyOwner | Owner |
| `transferOwnership()` | onlyOwner (Ownable2Step) | Owner |

## USDC Integration

The contract interacts with Circle's USDC (Base mainnet: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`). USDC is pulled from the user during `buy()` via `safeTransferFrom` and pushed to the user during `refund()` via `safeTransfer`. All backing is tracked via `USDC.balanceOf(address(this))` live — there is no internal reserve counter.

## Reserve Management

Reserves work as follows:

1. When a user calls `buy(amount)`, USDC is pulled into the contract.
2. dmfUSD is minted to the user: `amount - fee`.
3. The fee is split into a 15 bps backing portion and a 10 bps Operations portion. The backing portion stays in the contract as excess backing.
4. `totalAssets()` returns `USDC.balanceOf(address(this))` — the live USDC balance.

This means the backing ratio is always >= 100%, and it increases over time as fees accumulate.

## Routing Integration

The contract exposes no routing entrypoints to integrate with: there is nothing to configure and no caller allowlist. Cross-chain access happens outside dmfUSD, on the external BlockchainBridge service, which holds no privileged access to the contract. Direct flows are `buy()`, `refund()` and `refundTo()`.

## Supply Tracking

- `totalSupply()` = standard ERC-20 total supply.
- `totalMinted` and `totalBurned` — internal counters tracking total minting and burning activity.
- `getBackingPerToken()` = `(USDC.balanceOf(this) * 1e6) / totalSupply()` — shows backing ratio with 6 decimal precision (matching USDC decimals).
- Backing ratio is always >= 100% because each fee's backing share (0.15% of the transaction) is added to the reserve as USDC without minting new dmfUSD, while the operations share (0.10%) is minted against USDC that stays in the contract.
