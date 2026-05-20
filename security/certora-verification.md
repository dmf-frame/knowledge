# Certora Formal Verification

The dmfUSD contract was formally verified using the Certora Prover to mathematically prove critical protocol invariants.

## Full Spec (7/7 Rules Verified)

The complete Certora specification proved 7 rules covering all core contract behaviors:

| Rule | Status | What It Proves |
|------|--------|----------------|
| `always_reverts_on_reentrancy` | ✅ | buy/refund cannot be re-entered |
| `fee_is_bounded` | ✅ | Fee never exceeds $20 |
| `buy_increases_totalSupply` | ✅ | Supply increases by correct amount |
| `mint_burn_symmetry` | ✅ | buy+refund cycles preserve reserves |
| `permit_approval` | ✅ | EIP-2612 signature verification correct |
| `onlyComposer_cannot_be_called_by_user` | ✅ | buyFromComposer gated from public |
| `deposit_and_redeem_public_access` | ✅ | deposit/redeem are public (nonReentrant only) |

## Lean Spec (3 Core Invariants Proved)

A focused "lean spec" was also run to mathematically prove the three most critical economic invariants:

| Rule | Type | Status | What It Proves |
|------|------|--------|----------------|
| `supply_not_underflow` | Invariant | ✅ Proved | `totalSupply >= totalMinted - totalBurned` — dev fee mints create the delta |
| `fee_cap_validity` | Rule | ✅ Proved | 25 bps fee never exceeds $20 `MAX_VARIABLE_FEE_USDC` |
| `fee_split_consistency` | Rule | ✅ Proved | devFee (10/25) + backingFee (15/25) always equals totalFee |

## Structural Approach

The verification used CVL (Certora Verification Language) to model the contract's state transitions. The prover exhaustively checks all possible execution paths against the specified rules, including:

- All possible caller addresses (composer, non-composer, owner, random user)
- All possible input amounts (zero, small, large, cap-boundary)
- All possible state combinations (initial, post-buy, post-refund, post-transfer)
- Reentrancy scenarios via callbacks

## Prover Runs

```bash
cd ~/DMF-org/certora
certoraRun \
    contracts/dmfUSD.sol \
    --verify dmfUSD:specs/dmfUSD.spec \
    --rule_sanity basic \
    --msg "dmfUSD full verification"
```

**Report URL**: https://prover.certora.com/output/7827024/1c746d6b45d34122a75335c4d19dfc05?anonymousKey=ddd34558aa7ccfab63efc0d2633c830ad1d6c98d

## Known Limitations

Two properties were excluded from the lean spec due to Certora limitations:
- `backing_minimum` — depends on `USDC.balanceOf()`, which is Havoc'd by low-level `.call()` in SafeERC20
- `owner_preserved` — `renounceOwnership()` by-design sets owner to zero

These are covered by Foundry invariant tests instead.
