# Foundry Invariant Test Results

The dmfUSD contract was tested using Foundry's stateful invariant testing framework with maximum profile settings.

## Test Configuration

- **Framework**: Foundry (Forge) v1.5.1
- **Profile**: Maximum
- **Fuzz runs**: 10,000,000 per test (18 tests)
- **Invariant runs**: 1,000,000 per invariant (8 invariants)
- **Sequence depth**: 20 calls per sequence
- **Handler functions**: buy, buyTo (via composer), refund, refundTo, deposit, redeem, transfer, setComposer
- **Total function calls**: 128,000,000+ (8 invariants × 1M runs × 20 depth)

## Invariant Results

| Invariant Name | Runs | Depth | Status | Description |
|----------------|------|-------|--------|-------------|
| `invariant_solvency` | 1,000,000 | 20 | ✅ PASS | USDC balance backing consistency |
| `invariant_balance_backing_ consistency` | 1,000,000 | 20 | ✅ PASS | USDC.balanceOf(contract) is the true backing |
| `invariant_devs_get_dmfUSD_not_USDC` | 1,000,000 | 20 | ✅ PASS | No USDC transfer path to devs |
| `invariant_totalAssets_matches_balance` | 1,000,000 | 20 | ✅ PASS | totalAssets() ≡ USDC.balanceOf(this) |
| `invariant_maxDeposit_noCap` | 1,000,000 | 20 | ✅ PASS | Unlimited deposit capacity |
| `invariant_maximum_fee_bound` | 1,000,000 | 20 | ✅ PASS | Fee at threshold ≤ $20 cap |
| `invariant_fee_split_integrity` | 1,000,000 | 20 | ✅ PASS | 25 bps total (10 dev + 15 backing) |
| `invariant_deposit_redeem_consistency` | 1,000,000 | 20 | ✅ PASS | ERC-4626 surface consistency |

## Edge Cases Tested

With depth = 20, each sequence can contain up to 20 function calls before checking invariants. This tests complex interaction patterns such as:

- Multiple buys at different amounts
- Buy → transfer → refundTo → deposit → buy → refund → redeem → transfer → setComposer
- Fee cap boundary at exactly $20 and above
- Zero amounts, maximum amounts, and everything in between
- Composer vs non-composer callers
- Multiple concurrent users

## Fuzz Results (18 tests, 10M runs each)

| Test | Runs | Status |
|------|------|--------|
| `testFuzz_buy_increasesBalance` | 10,000,000 | ✅ PASS |
| `testFuzz_buy_increasesReserves` | 10,000,000 | ✅ PASS |
| `testFuzz_buy_devsGetDmfUsd` | 10,000,000 | ✅ PASS |
| `testFuzz_buyFromComposer_matchesPublicBuy` | 10,000,000 | ✅ PASS |
| `testFuzz_refund_returnsUSDCToUser` | 10,000,000 | ✅ PASS |
| `testFuzz_refundTo_sendsToRecipient` | 10,000,000 | ✅ PASS |
| `testFuzz_deposit_sharesMatchPreview` | 10,000,000 | ✅ PASS |
| `testFuzz_redeem_assetsMatchPreview` | 10,000,000 | ✅ PASS |
| `testFuzz_feeCapNeverExceeded` | 10,000,000 | ✅ PASS |
| `testFuzz_feeDevPlusBackingEqualsTotal` | 10,000,000 | ✅ PASS |
| `testFuzz_nonComposerCannotCallBuyFromComposer` | 10,000,000 | ✅ PASS |
| `testFuzz_depositEveryoneCanCall` | 10,000,000 | ✅ PASS |
| `testFuzz_redeemEveryoneCanCall` | 10,000,000 | ✅ PASS |
| `testFuzz_previewConsistency` | 10,000,000 | ✅ PASS |
| `testFuzz_buyThenRefund_stateConserved` | 10,000,000 | ✅ PASS |
| `testFuzz_buyFromComposerRevertsZeroBuyer` | 10,000,000 | ✅ PASS |
| `testFuzz_buyFromComposerRevertsZeroAmount` | 10,000,000 | ✅ PASS |
| `testFuzz_setDevFeeRecipients_onlyOwner` | 10,000,000 | ✅ PASS |

All tests passed with zero failures.
