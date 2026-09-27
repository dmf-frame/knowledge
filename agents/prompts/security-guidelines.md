---
title: DMF Security Review Prompt
description: Reusable prompt template for security review of current DMF integrations
audience: ai
section: agents
order: 6
---

# DMF Security Review Prompt

## Review Scope

Analyze the following {codeType} for security issues related to current dmfUSD integration.

## Security Checklist

### Contract And Address Safety

- [ ] Are all contract addresses verified against official DMF deployment addresses?
- [ ] Is the app using Base network for dmfUSD interactions?
- [ ] Are USDC and dmfUSD decimals handled correctly?
- [ ] Are return values and failed transactions handled safely?

### Buy / Refund Flow Safety

- [ ] Is USDC allowance checked before buy?
- [ ] Is dmfUSD balance checked before refund?
- [ ] Are displayed fees consistent with 0.25% capped at $20 for direct buy/refund?
- [ ] Is the 60% backing / 40% Operations split described correctly when shown?

### Backing Verification

- [ ] Is backing calculated from live USDC balance of the dmfUSD contract?
- [ ] Is total supply read from the dmfUSD contract?
- [ ] Does the UI avoid implying a fixed peg or market-price guarantee?

### Integration Security

- [ ] Are RPC endpoints using HTTPS/WSS?
- [ ] Are private keys stored outside code?
- [ ] Are secrets excluded from logs and client bundles?
- [ ] Are route quotes refreshed before transaction submission?

## Explicit Non-Findings For Current dmfUSD

Do not review current dmfUSD as if it has:

- oracle price feeds,
- debt positions,
- collateral-ratio thresholds,
- liquidation flows,
- pause/circuit-breaker mechanics.

If these appear in docs or code comments, flag them as stale/outdated content.

## Output Format

```text
## Findings Summary
- Critical: {count}
- High: {count}
- Medium: {count}
- Low: {count}

## Detailed Findings
1. [SEVERITY] Title, description, impact, recommendation.
```
