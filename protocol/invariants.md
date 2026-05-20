# Protocol Invariants

The DMF protocol is built on a set of mathematical invariants that must hold true under all conditions. These have been verified through Foundry invariant testing (1M+ runs, depth 20) and Certora formal verification.

## 1. Supply ≤ Reserves (Solvency)

The total supply of dmfUSD must never exceed the USDC balance held by the contract. Because fees are deducted before minting and retained as excess backing, the backing ratio is always >= 100%. The invariant `USDC.balanceOf(this) >= totalSupply` is the core solvency guarantee.

## 2. Reserves Not Overstated (N/A — Live Balance)

Since the contract uses `USDC.balanceOf(this)` directly (no internal `usdcReserves` counter), there is no separate accounting variable that could be overstated. The live balance IS the reserve. This design eliminates the griefing vector where direct transfers could inflate a tracked reserve counter differently from the actual balance.

## 3. No Admin Drain Path

There is no function that allows an admin to withdraw USDC from the contract. The only way USDC leaves the contract is through user-initiated `refund()` or `refundTo()` calls. Dev fees are paid in dmfUSD, not USDC — verified as a structural invariant.

## 4. Fee Is Bounded

The total fee per transaction must never exceed `MAX_VARIABLE_FEE_USDC` ($20). This is enforced at the contract level and verified by fuzz testing across 180M+ cases.

## 5. Fee Split Integrity

The dev fee + backing fee must always equal the total fee. With the current parameters: dev fee = 10 bps, backing fee = 15 bps, total = 25 bps. This holds across all amounts including at the cap boundary.

## 6. Buy Increases Total Supply

When `buy()` is called, `totalSupply` must increase by exactly `amount - fee`. The supply increase is deterministic and always matches the expected calculation.

## 7. Refund Decreases Total Supply

When `refund()` is called, `totalSupply` must decrease by exactly the burn amount. No extra tokens are burned or created.

## 8. Mint-Burn Symmetry

A buy followed by a refund cycle preserves `USDC.balanceOf(this) - fees`. Over any complete cycle, the backing retained from fees accumulates, but the relationship between supply and balance remains consistent.

## 9. Composer-Only Functions Are Gated

`buyFromComposer()` can only be called by the registered LiFi Composer address. Any other caller triggers a revert. `deposit()` and `redeem()` are public (no `onlyComposer` guard). This is verified by Certora.

## 10. ERC-4626 Surface Consistency

All ERC-4626 preview functions (`previewDeposit`, `previewRedeem`, `convertToShares`, `convertToAssets`) must produce values consistent with the actual `buy()` and `refund()` operations. `totalAssets()` must equal `USDC.balanceOf(this)` exactly.

## 11. Reentrancy Protection

`buy()` and `refund()` are protected by OpenZeppelin's `ReentrancyGuard`. Multiple sequential operations are safe and cannot be re-entered.

## 12. Backing Never Negative

The backing fee component must always be >= 0. With the current fee structure, backing is always positive (15 of 25 bps).
