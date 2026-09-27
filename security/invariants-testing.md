---
title: Foundry Invariant Test Results
description: The 8 stateful invariants, fuzz coverage, and the exact test profile behind the published operation counts.
audience: both
section: security
order: 4
---

# Foundry Invariant Test Results

The dmfUSD contract was tested using Foundry's stateful invariant testing framework. The sanctioned suite is **60 tests = 24 unit + 12 economic scenario + 16 fuzz + 8 invariant**, with 104M+ executed contract operations. The full log lives in `public/security-report.md` in the DMF-org site repo; the counts below come from that run and are reproducible with `forge test` from the repo root, which applies `[fuzz] runs = 100000` and `[invariant] runs = 100000, depth = 128` from the root `foundry.toml`.

## Test Configuration

- **Framework**: Foundry (Forge)
- **Fuzz runs**: 100,000 per test (16 fuzz tests in `test/dmfUSDv2Fuzz.t.sol`)
- **Invariant runs**: 100,000 per invariant (8 invariants in `test/dmfUSDv2Handler.t.sol`)
- **Sequence depth**: 128 calls per sequence (`[invariant] depth = 128` in the root `foundry.toml`; 8 × 100,000 × 128 = 102.4M handler calls)
- **Handler functions** (from `dmfUSDv2Handler.t.sol`): `buy`, `refund`, `refundTo`, `transfer` (the four targeted selectors; `transfer` is a handler function alongside the three token entry points)

There are no `deposit` or `redeem` handlers. Those functions do not exist on the deployed contract.

## Invariant Results

Names below are the eight `invariant_*` functions in `test/dmfUSDv2Handler.t.sol`.

| Invariant Name | Runs | Depth | Status | Description |
|----------------|------|-------|--------|-------------|
| `invariant_totalAssets_matches_balance` | 100,000 | 128 | PASS | `totalAssets()` ≡ `USDC.balanceOf(contract)` |
| `invariant_solvency` | 100,000 | 128 | PASS | USDC reserves always cover total supply |
| `invariant_maximum_fee_bound` | 100,000 | 128 | PASS | Fee at threshold ≤ $20 cap |
| `invariant_fee_split_integrity` | 100,000 | 128 | PASS | Dev fee + backing fee always equals total fee |
| `invariant_no_deposit_cap` | 100,000 | 128 | PASS | Unlimited deposit capacity (`maxDeposit`) |
| `invariant_callSummary` | 100,000 | 128 | PASS | Handler call bookkeeping consistent |
| `invariant_P_increases_on_buy` | 100,000 | 128 | PASS | Backing-per-token increases monotonically on buys |
| `invariant_conservation` | 100,000 | 128 | PASS | Value conservation across arbitrary sequences |

## Edge Cases Tested

With depth = 128, each sequence can contain up to 128 function calls before checking invariants. This tests complex interaction patterns such as:

- Multiple buys at different amounts
- Buy → transfer → refundTo → buy → refund → transfer
- Fee cap boundary at exactly $20 and above
- Zero amounts, maximum amounts, and everything in between
- Multiple concurrent users

## Fuzz Results (16 tests, 100,000 runs each)

Names below are the sixteen `testFuzz_*` functions in `test/dmfUSDv2Fuzz.t.sol`.

| Test | Runs | Status |
|------|------|--------|
| `testFuzz_buy_increasesBalance` | 100,000 | PASS |
| `testFuzz_buy_usdcTransferred` | 100,000 | PASS |
| `testFuzz_buy_devsMinted` | 100,000 | PASS |
| `testFuzz_buy_backingIncreases` | 100,000 | PASS |
| `testFuzz_refund_returnsUSDC` | 100,000 | PASS |
| `testFuzz_refundTo_sendsToRecipient` | 100,000 | PASS |
| `testFuzz_feeUnderCap` | 100,000 | PASS |
| `testFuzz_feeDevPlusBackingEqualsTotal` | 100,000 | PASS |
| `testFuzz_previewDepositConsistent` | 100,000 | PASS |
| `testFuzz_previewRedeemConsistent` | 100,000 | PASS |
| `testFuzz_buyRefund_stateConserved` | 100,000 | PASS |
| `testFuzz_reentrancyGuard_safe` | 100,000 | PASS |
| `testFuzz_setDevFee_onlyOwner` | 100,000 | PASS |
| `testFuzz_zeroBuy_reverts` | 100,000 | PASS |
| `testFuzz_zeroRefund_reverts` | 100,000 | PASS |
| `testFuzz_multipleBuys_Pincreases` | 100,000 | PASS |

All tests passed with zero failures.

## Independent re-run (2026-09-28)

Re-ran the suite from the current source on a separate host (16 threads, same repo-root profile) and
reproduced every published number:

- 60 tests passed, 0 failed — 24 unit, 12 economic scenario, 16 fuzz, 8 invariant.
- Every invariant reported `runs: 100000, calls: 12800000` → 8 × 12.8M = 102,400,000 invariant calls.
- Fuzz: 16 × 100,000 = 1,600,000 cases. Total: 104.0M executed operations.
- Duration 2,952s at 16 threads (the 1,426s figure elsewhere is a 20-thread run on the 2026-08-05 host).
- The handler logged 7-12 reverts per invariant, all on `buy` out of ~3.2M calls each — deliberate
  dust/allowance revert paths, not invariant violations.
