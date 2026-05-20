---
title: DMF Security Review Prompt
description: Reusable prompt template for security review of DMF-related code and interactions
audience: ai
section: agents
order: 6
---

# DMF Security Review Prompt

## Review Scope
Analyze the following {codeType} for security issues related to DMF protocol integration.

## Security Checklist

### Smart Contract Interactions
- [ ] Are all contract addresses verified against official DMF deployment addresses?
- [ ] Is the `approve`/`allowance` pattern followed correctly? (check for race conditions)
- [ ] Are return values from `transfer`/`transferFrom` checked?
- [ ] Are reentrancy guards in place for external calls?
- [ ] Is `msg.value` handled correctly for payable functions?

### Oracle Safety
- [ ] Is the oracle price checked for staleness (`DMFOracle.isStale()`)?
- [ ] Is a deviation tolerance applied (e.g., refuse >5% change within 1 block)?
- [ ] Are fallback oracles configured if primary fails?

### Economic Security
- [ ] Do mint/redeem amounts respect minimum/maximum limits?
- [ ] Is the collateral ratio validated against the liquidation threshold?
- [ ] Are fee-on-transfer tokens handled correctly?
- [ ] Is there a circuit breaker or pause mechanism?

### Integration Security
- [ ] Are RPC endpoints using HTTPS/WSS?
- [ ] Are private keys stored in environment variables, not code?
- [ ] Are gas limits set with safety margins (+20% minimum)?
- [ ] Are failed transactions retried with exponential backoff?

## Risk Assessment
Rate each finding: CRITICAL (loss of funds), HIGH (protocol manipulation), MEDIUM (users could lose small amounts), LOW (best practice violation).

## Output Format
```
## Findings Summary
- Critical: {count}
- High: {count}
- Medium: {count}
- Low: {count}

## Detailed Findings
1. **[SEVERITY] Title** — Description, impact, recommendation.
```
