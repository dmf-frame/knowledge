---
title: Security Testing Approach
description: Why DMF tests in-house with an exploit-canary corpus instead of hiring external audit firms.
audience: both
section: security
order: 2
---

# Security Testing Approach

**Date**: 2026-09-28 (last verified)
**Contract**: dmfUSD (Solidity 0.8.30)

## Why DMF tests in-house (no external audit firms)

DMF does not hire external audit firms. External audits are point-in-time checklists. DMF tests the contract against the known exploit environment — historic patterns, reentrancy families, flash-loan attacks — using a living corpus of how hacks actually happened.

DMF maintains a private exploit-canary database (real tx hashes + re-detection probes) covering historic incidents drawn from DeFiHackLabs, DefiLlama, and SlowMist. Attack patterns run as active probes. No published canary count.

## What was run

| Layer | Tool | Result |
|-------|------|--------|
| Unit + economic tests | Foundry | 36 tests — all pass |
| Fuzz tests | Foundry | 16 tests, 100k runs each — all pass |
| Invariant tests | Foundry | 8 tests, 100k runs at depth 128 (root `foundry.toml`) — all pass |
| Formal verification | Certora Prover | 10 checks (math + system rules) — verified |
| Static analysis | Slither | 0 High, 0 Low, 16 Medium (assessed benign), 6 Informational (2026-08-05) |
| Static analysis | Aderyn | 0 High, 0 Medium, 4 Low (2026-08-05) |

Total: 60 tests, zero failures, 104M+ executed contract operations, zero high-severity findings.

## Honest caveats

- The token launched recently — it is NOT years battle-tested. Live history is shorter than the testing corpus.
- The exploit-canary database is private (methodology described here; contents not published).
- No smart contract is 100% risk-free. This describes what was done, not a guarantee.

## Related

- [Security Summary (in-house)](./audit-summary.md) — detailed test configuration and results
- [FAQ — Is dmfUSD audited?](../guides/faq.md)
