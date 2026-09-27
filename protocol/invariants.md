---
title: Protocol Invariants
description: Properties the dmfUSD contract must always satisfy, and the Foundry and Certora verification behind each.
audience: both
section: protocol
order: 4
---

# Protocol Invariants

The DMF protocol is built on a set of mathematical invariants that must hold true under all conditions. They are checked by two independent systems: the 8 Foundry stateful invariant tests (100,000 runs each at depth 128 under the `security` test profile) and 10 Certora Prover checks. The list below is the property set those tools cover.

## 1. Supply ≤ Reserves (Solvency)

The total supply of dmfUSD must never exceed the USDC balance held by the contract. Because fees are deducted before minting and retained as excess backing, the backing ratio is always >= 100%. The invariant `USDC.balanceOf(this) >= totalSupply` is the core solvency guarantee.

## 2. Reserves Not Overstated (N/A — Live Balance)

Since the contract uses `USDC.balanceOf(this)` directly (no internal `usdcReserves` counter), there is no separate accounting variable that could be overstated. The live balance IS the reserve. This design eliminates the griefing vector where direct transfers could inflate a tracked reserve counter differently from the actual balance.

## 3. No Admin Drain Path

There is no function that allows an admin to withdraw USDC from the contract. The only way USDC leaves the contract is through user-initiated `refund()` or `refundTo()` calls. Dev fees are paid in dmfUSD, not USDC — verified as a structural invariant.

## 4. Fee Is Bounded

The total fee per transaction must never exceed `MAX_VARIABLE_FEE_USDC` ($20). This is enforced at the contract level and verified by fuzz + invariant testing.

## 5. Fee Split Integrity

The Operations fee + backing fee must always equal the total fee. With the current parameters: Operations fee = 10 bps, backing fee = 15 bps, total = 25 bps. This holds across all amounts including at the cap boundary.

## 6. Buy Increases Total Supply

When `buy()` is called, `totalSupply` increases by exactly two mints: the buyer's shares for `usdcAmount - fee`, and the operations commission minted from the 0.10% share — both priced at the pre-deposit backing-per-token. No other supply is ever created.

## 7. Refund: Net Supply Falls by Burn Minus Operations Mint

When `refund()` is called, `totalSupply` decreases by the burned `tokenAmount` and increases again by the operations commission minted in the same call — 10 bps of the gross USDC value (capped, split between the two fee recipients). The net change is `devCommissionDmfUsd - tokenAmount`, not the burn amount alone. The two legs are tracked separately: `totalBurned` counts the refund burn, `totalMinted` counts both the buy mints and this operations mint, and the Certora `supply_tracking` invariant asserts `totalSupply() == totalMinted() - totalBurned()`.

## 8. Buy-Refund Symmetry

A buy-then-refund cycle returns the user's principal minus fees and leaves the contract with a higher USDC-per-token ratio than before the cycle: the 0.15% backing share is never returned to anyone.

## 9. No Privileged or Route-Only Entrypoints

The deployed contract has no privileged routing entrypoints and no router role — no address is trusted to move funds, and nothing pre-funds backing on a caller's behalf. The state-changing surface is exactly `buy()`, `refund()` and `refundTo()` (callable by anyone, `nonReentrant`), plus the owner-only `setDevFeeRecipients()`, which only sets the two fee-recipient addresses and their split and cannot move USDC; the sole other owner-gated function is Ownable2Step's `transferOwnership()`, which moves ownership, not funds. `buy()` pulls USDC straight from `msg.sender` via `safeTransferFrom`.

## 10. Read-Only Quote Surface Consistency

The contract exposes an ERC-4626-style **read-only** quote surface — `asset()`, `totalAssets()`, `convertToShares`/`convertToAssets`, `preview*`, `max*` — and no `deposit()`, `mint()`, `withdraw()` or `redeem()`. Those quote functions must stay consistent with the real `buy()` and `refund()` math, and `totalAssets()` must equal `USDC.balanceOf(this)` exactly.

## 11. Reentrancy Protection

`buy()` and `refund()` are protected by OpenZeppelin's `ReentrancyGuard`. Multiple sequential operations are safe and cannot be re-entered.

## 12. Backing Never Negative

The backing fee component must always be >= 0. With the current fee structure, backing is always positive (15 of 25 bps).
