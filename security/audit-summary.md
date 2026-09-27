---
title: Security Summary (in-house)
description: In-house security summary for dmfUSD: Foundry results, Certora checks, and static-analysis findings.
audience: both
section: security
order: 1
---

# Security Summary (in-house)

**Date**: 2026-09-28 (last verified)
**Contract**: dmfUSD (Solidity 0.8.30)
**Repository**: DMF-org (site + contract source)
**Type**: In-house verification — no external audit firm has been engaged (see [Testing Approach](./testing-approach.md))

## Testing Methodology

The dmfUSD contract is tested with the current Foundry suite — 60 tests (24 unit + 12 economic scenario + 16 fuzz + 8 invariant), zero failures, including 104M+ executed contract operations — plus formal verification via the Certora Prover.

### 1. Unit + economic scenario tests (36 tests)
`dmfUSDv2Unit.t.sol` (24 tests): public and restricted functions, access control, edge cases (zero amounts, zero addresses), the $20 fee-cap boundary, the read-only quote helpers, and permit approvals. `dmfUSDv2Economic.t.sol` (12 tests): churn, growth, all-refund and worst-case paths with exact amounts. All 36 pass.

### 2. Fuzz Tests (16 tests)
16 fuzz tests exercising buy, refund, fee calculations, reentrancy safety, access control, and preview consistency across random inputs. Fuzz runs: 100,000 per test — set by `[fuzz] runs = 100000` in the repo-root `foundry.toml` (run `forge test` from the repo root).

### 3. Stateful Invariant Tests (8 tests)
8 invariant tests covering solvency, reserve accuracy, fee bounds, fee split integrity, and read-only ERC-4626-style quote consistency across arbitrary multi-step sequences. Invariant runs: 100,000 at depth 128, set by `[invariant]` in the repo-root `foundry.toml`.

## Test Configuration

```toml
# foundry.toml at the repo root (compiles app/dmftokens, optimizer on, via_ir)
[fuzz]
runs = 100000

[invariant]
runs = 100000
depth = 128
```

Run from the repo root: `forge test`. The nested `app/dmftokens/foundry.toml` is the
quick profile (default fuzz runs) — running there reproduces the 60 test names but not
the 100,000-run counts.

## Results Summary

| Test Type | Total | Status |
|-----------|-------|--------|
| Unit + economic tests | 36 | ✅ All Pass |
| Fuzz Tests | 16 | ✅ All Pass |
| Invariant Tests | 8 | ✅ All Pass |
| **Total** | **60** | ✅ **ALL PASS** |

## Certora Formal Verification

10 checks verified using the Certora Prover (math + system rule sets):

Math spec (`dmfUSD.math.spec`):
- `fee_formula_matches_implementation` — fee formula matches the contract implementation

System spec (`dmfUSD.system.spec`):
- `supply_tracking` — total supply tracks buys/refunds
- `reserve_covers_supply` — USDC reserves always cover supply (solvency)
- `token_never_approves_usdc_spender` — contract never approves USDC spending
- `valid_developer_configuration` — dev fee config is valid
- `configured_asset_is_six_decimal_usdc` — asset is 6-decimal USDC
- `backing_getter_respects_exact_reserve_invariant` — backing getter matches reserves
- `public_solvency_view_is_covered` — solvency view is sound
- `buy_pulls_exact_usdc_and_does_not_dilute` — buy pulls exact USDC, no dilution
- `refund_cannot_overdraw_or_dilute` — refund cannot overdraw or dilute

## Build identity (verified 2026-09-28)

- The deployed runtime at `0x3a6f90b8517ff16b7a8c368f05f38bb03afd4aa7` is **source-verified on BaseScan** (exact match).
- Compiling the repository source (`app/dmftokens/dmfUSD.sol`) with the repo-root `foundry.toml` (optimizer 200, `via_ir`) produces a 10,074-byte runtime that is byte-identical to the deployed runtime **except** for the constructor-injected immutables (USDC address, EIP-712 name/version hashes) and the trailing CBOR compiler-metadata hash.
- Method: `forge build`, then diff `out/dmfUSD.sol/dmfUSD.json` `deployedBytecode` against `cast code 0x3a6f...4aa7` byte by byte. That is a logic-level match, not a bit-for-bit reproducible build — replicate it with the same command if you need to re-check.

## Static Analysis

### Slither (Trail of Bits)

2026-08-05 run (project mode, dependencies excluded), matching `public/security-report.md` in the site repo:
- **0 High, 0 Low**, 16 Medium, 6 Informational
- All 16 Medium are `incorrect-equality` — strict equality zero-guards in the ERC-4626-style converters (`supply == 0`, `reserves == 0`, `shares == 0`, `grossAssets == 0`, `netAssets == 0`, `amountDmfUsd == 0`). Assessed BENIGN in context.
- 6 Informational: 1 missing-inheritance (interface), 5 naming-convention (style)

### Aderyn (Cyfrin)

2026-08-05 run (88 detectors), matching `public/security-report.md` in the site repo:
- **0 High, 0 Medium**, 4 Low:
  - L-1 Centralization Risk — owner can set dev-fee recipients only (`setDevFeeRecipients`, Ownable2Step); fee rate/cap are immutable constants — by design
  - L-2 Large Numeric Literal (`10_000`, `20_000_000`) — style
  - L-3 Literal Instead of Constant — style
  - L-4 (unchecked-return family) — style/no-impact

## Scope

The verification scope covers the `dmfUSD` contract, its ERC-4626-style **read-only** quote surface (`asset`, `totalAssets`, `convertToShares` / `convertToAssets`, `preview*` / `max*`), fee accounting, reserve management, and access control. There are no `deposit()`, `mint()`, `withdraw()`, or `redeem()` functions. Cross-chain swap/bridge is an external service, not part of this contract.

## Conclusion

Zero high-severity findings in the current test suite — 60 tests (24 unit + 12 economic scenario + 16 fuzz + 8 invariant), zero failures, including 104M+ executed contract operations — plus 10 Certora Prover checks and Slither/Aderyn static analysis. dmfUSD is deployed and frozen on Base mainnet at `0x3a6f90b8517ff16b7a8c368f05f38bb03afd4aa7`.

---

## In-house only

In-house security only. Foundry: 60 tests, 0 failures, 104M+ ops. Certora: 10 checks. Slither/Aderyn: 0 High (16 Medium assessed benign; 4 Low). Testing uses an exploit-canary methodology. USDC-backed on Base; owner cannot touch funds. No user volume yet (totalSupply 0 at the time of writing), so the record is code-verified rather than battle-tested by real usage.

See [Testing Approach](./testing-approach.md) for why DMF tests in-house (no external audit firms).
