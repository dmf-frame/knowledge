---
title: Threat Model
description: Residual risks for dmfUSD holders: USDC issuer risk, contract risk, and what the contract cannot do.
audience: both
section: security
order: 5
---

# Threat Model

This document describes current dmfUSD risks.

## Smart Contract Risks

### Bug or Vulnerability

Despite extensive tests and formal verification, no software is guaranteed bug-free. A previously undetected vulnerability could lead to loss of funds.

**Mitigation**: Unit, fuzz, invariant, formal verification, and static analysis are used to reduce risk.

### Admin Key Compromise

The owner has limited powers, and ownership is **not** renounced. An active Ownable2Step owner can only call `setDevFeeRecipients` to update the two operations-fee recipients and their split. A compromised owner key could change those recipients — it cannot mint, freeze, pause, upgrade, or change fee rates or core behaviour.

**Mitigation**: The contract has no admin mint, no freeze function, and no pause function. The owner's only power is `setDevFeeRecipients` (two operations-fee recipients and their split). This posture is documented in `overview/key-concepts.md` and `meta/wrong-claims.json`.

### Reentrancy

State-changing flows use reentrancy protection and checks-effects-interactions patterns.

## USDC Dependency

### USDC Depeg

dmfUSD is backed by USDC. If USDC loses value against USD, dmfUSD's USD-denominated value would reflect that reserve-asset risk.

**Mitigation**: DMF does not add leverage or debt on top of USDC. This is reserve-asset risk, not a DMF oracle/liquidation risk.

### USDC Freeze

Circle can freeze USDC at an address, including the dmfUSD contract. This could affect refunds while a freeze remains active.

**Mitigation**: This is systemic USDC risk. DMF uses native USDC on Base to minimize intermediary risk.

## Base Chain Risks

### Base Sequencer Failure

If Base has an outage, users cannot interact with dmfUSD until the chain recovers.

### Reorgs

Chain reorganizations could affect transaction ordering. The protocol relies on standard Ethereum finality.

## User-Side Risks

### Fee Miscalculation

Users who do not account for the 0.25% direct buy/refund fee, capped at $20, may receive less dmfUSD or USDC than expected.

### Cross-Chain Mistakes

Sending assets directly to unsupported bridge or contract addresses can result in lost funds. Users should use documented DMF app flows.

### Wallet / Phishing

Users approving malicious contracts to spend dmfUSD or USDC could lose funds.

## Risk Summary

| Category | Risk Level | Notes |
|---|---:|---|
| Smart contract bug | Low | Tests and verification reduce risk, but cannot eliminate it |
| Admin key compromise | Low | Owner can only set the two operations-fee recipients (`setDevFeeRecipients`); no mint, freeze, pause, or upgrade |
| USDC depeg | Medium | Same reserve-asset risk as holding USDC |
| USDC freeze | Low | Systemic to USDC ecosystem |
| Base chain outage | Low | All Base apps affected |
| User error | Medium | Mitigated by UI previews and clear docs |

DMF is designed to minimize trust assumptions. The most material risks are smart contract risk, reserve-asset risk, Base availability, and user-side wallet/transaction mistakes.
