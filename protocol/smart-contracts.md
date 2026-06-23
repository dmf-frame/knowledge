# Smart Contract Architecture

## Overview

The DMF protocol on Base consists of a single core token contract (`dmfUSD`). The system is designed to be minimal, auditable, and composable.

## dmfUSD — The Core Token

`dmfUSD.sol` is the central contract. It holds USDC reserves, mints dmfUSD, burns dmfUSD, and enforces the fee model. It inherits from standard OpenZeppelin contracts:

```
dmfUSD
  ├── ERC20 (OpenZeppelin)       → name, symbol, totalSupply, balanceOf, transfer
  ├── ERC20Permit (OZ)           → permit() for gasless approvals
  ├── ReentrancyGuard (OZ)       → nonReentrant on buy/refund
  └── Ownable2Step (OZ)          → 2-step ownership transfer
```

### Key Design Decisions

- **Decimals = 6** — matches USDC, eliminating decimal conversion errors.
- **No tracked `usdcReserves` variable** — backing is `USDC.balanceOf(address(this))` live. The contract explicitly states: `// NOTE: No tracked usdcReserves — backing = USDC.balanceOf(this) live.`
- **No admin mint/freeze/pause** — privileged routing entrypoints are restricted to their configured caller. There is no admin mint function, no freeze mechanism, and no pause functionality after initial configuration.

### Primary User Functions

- `buy(usdcAmount)` — User deposits USDC and receives newly minted dmfUSD. Anyone can call this.
- `refund(tokenAmount)` — User burns dmfUSD and receives USDC back. Anyone can call this.
- `refundTo(recipient, tokenAmount)` — Burn dmfUSD and send USDC to a chosen EVM recipient.

### Privileged Routing Functions

- Internal route-only entrypoints are restricted to configured callers. Public users should use direct `buy()` and `refund()` flows.

### ERC-4626 Surface

The contract also exposes a standard ERC-4626 vault interface for composability:

- `deposit(assets, receiver)` — Anyone can call (only `nonReentrant` guard). Like `buy()` but follows ERC-4626 semantics.
- `redeem(shares, receiver, owner)` — Anyone can call (only `nonReentrant` guard). Like `refund()` but follows ERC-4626 semantics.
- Preview functions: `previewDeposit`, `previewRedeem`, `convertToShares`, `convertToAssets`.
- View functions: `asset()` returns USDC address, `totalAssets()` returns `USDC.balanceOf(address(this))`.

### Access Control

| Function | Guard | Who Can Call |
|----------|-------|-------------|
| `buy()` | nonReentrant | Anyone |
| `refund()` / `refundTo()` | nonReentrant | Anyone |
| `deposit()` | nonReentrant | Anyone |
| `redeem()` | nonReentrant | Anyone |
| privileged route entrypoint | restricted + nonReentrant | Configured route caller |
| route setup function | onlyOwner | Owner |
| `setDevFeeRecipients()` | onlyOwner | Owner |
| `transferOwnership()` | onlyOwner (Ownable2Step) | Owner |

## USDC Integration

The contract interacts with Circle's USDC (Base mainnet: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`, Base Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`). USDC is pulled from the user during `buy()` via `safeTransferFrom` and pushed to the user during `refund()` via `safeTransfer`. All backing is tracked via `USDC.balanceOf(address(this))` live — there is no internal reserve counter.

## Reserve Management

Reserves work as follows:

1. When a user calls `buy(amount)`, USDC is pulled into the contract.
2. dmfUSD is minted to the user: `amount - fee`.
3. The fee is split into a 15 bps backing portion and a 10 bps Operations portion. The backing portion stays in the contract as excess backing.
4. `totalAssets()` returns `USDC.balanceOf(address(this))` — the live USDC balance.

This means the backing ratio is always >= 100%, and it increases over time as fees accumulate.

## Routing Integration

Public documentation should treat routing integrations generically. Users should not call internal route-only entrypoints directly; normal direct flows are `buy()` and `refund()`.

## Supply Tracking

- `totalSupply()` = standard ERC-20 total supply.
- `totalMinted` and `totalBurned` — internal counters tracking total minting and burning activity.
- `getBackingPerToken()` = `(USDC.balanceOf(this) * 1e6) / totalSupply()` — shows backing ratio with 6 decimal precision (matching USDC decimals).
- Backing ratio is always >= 100% because fees add excess reserves without minting extra tokens.
