---
title: Certora Formal Verification
description: The 10 Certora Prover checks run against dmfUSD, with rule names and what each one proves.
audience: both
section: security
order: 3
---

# Certora Formal Verification

The dmfUSD contract was formally verified using the Certora Prover to mathematically prove critical protocol invariants.

## Full Spec (10 Checks Verified)

The complete Certora verification proved 10 checks across two spec files covering all core contract behaviors:

### Math spec (`dmfUSD.math.spec`)

| Rule | Status | What It Proves |
|------|--------|----------------|
| `fee_formula_matches_implementation` | ✅ | The fee formula in the spec matches the contract implementation |

### System spec (`dmfUSD.system.spec`)

| Rule / Invariant | Type | Status | What It Proves |
|------|------|--------|----------------|
| `supply_tracking` | Invariant | ✅ | Total supply tracks buys/refunds correctly |
| `reserve_covers_supply` | Invariant | ✅ | USDC reserves always cover total supply (solvency) |
| `token_never_approves_usdc_spender` | Invariant | ✅ | Contract never approves USDC spending to itself |
| `valid_developer_configuration` | Invariant | ✅ | Dev fee configuration stays valid |
| `configured_asset_is_six_decimal_usdc` | Rule | ✅ | The configured asset is 6-decimal USDC |
| `backing_getter_respects_exact_reserve_invariant` | Rule | ✅ | Backing getter matches the exact reserve invariant |
| `public_solvency_view_is_covered` | Rule | ✅ | Public solvency view is sound |
| `buy_pulls_exact_usdc_and_does_not_dilute` | Rule | ✅ | buy() pulls exact USDC without diluting existing holders |
| `refund_cannot_overdraw_or_dilute` | Rule | ✅ | refund() cannot overdraw reserves or dilute holders |

## Structural Approach

The verification used CVL (Certora Verification Language) to model the contract's state transitions. The prover exhaustively checks all possible execution paths against the specified rules, including:

- All possible caller addresses (owner, holder, and arbitrary third-party caller — the contract has no route-caller role)
- All possible input amounts (zero, small, large, cap-boundary)
- All possible state combinations (initial, post-buy, post-refund, post-transfer)
- Reentrancy scenarios via callbacks

## Prover Runs

```bash
cd ~/DMF_web_v2                      # repo root — both conf files use repo-relative paths
certoraRun certora/conf/dmfUSD-system.conf    # 9 checks (system spec, linked-USDC model)
certoraRun certora/conf/dmfUSD-math.conf      # 1 check (exact fee arithmetic)
```

Reports are published from Certora Prover runs against the math and system specs. Job identifiers change between runs; use the URLs recorded in `DMF_web_v2/public/security-report.md` (2026-08-05 math + system jobs) as the current public record.

## Known Limitations

Two properties were excluded from the lean spec due to Certora limitations:
- `backing_minimum` — depends on `USDC.balanceOf()`, which is Havoc'd by low-level `.call()` in SafeERC20
- `owner_preserved` — `renounceOwnership()` by-design sets owner to zero

These are covered by Foundry invariant tests instead.
