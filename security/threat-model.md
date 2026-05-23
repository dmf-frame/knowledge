# Threat Model

This document describes the risk landscape for the DMF protocol. Understanding these risks helps users make informed decisions.

## Smart Contract Risks

### Bug or Vulnerability
Despite 308M+ test scenarios and formal verification, no software is guaranteed bug-free. A previously undetected vulnerability could lead to loss of funds.

**Mitigation**: Three-layer testing (unit, fuzz, invariant) with maximum profile settings. Certora formal verification on core invariants. Slither + Aderyn static analysis with zero high-severity findings.

### Admin Key Compromise
The contract owner can set the Composer address, update the dev wallet, and change fee parameters. If the owner key is compromised before ownership is renounced, an attacker could alter fee parameters.

**Mitigation**: The contract is designed so admin actions are limited. There is no admin mint, no freeze, no pause. After initial configuration, ownership is intended to be renounced. Dev fees are paid in dmfUSD (not USDC), limiting the impact of dev wallet compromise. Ownership transfer uses Ownable2Step (two-step process) for added security.

### Reentrancy
All state-changing functions use OpenZeppelin's `ReentrancyGuard`. Certora formally proved that buy/refund cannot be re-entered. Risk is extremely low.

### Composer / Integration Risk
The Composer address is the only privileged caller (via `onlyComposer` on `buyFromComposer`). If the Composer address is compromised or malicious, it could mint dmfUSD with fabricated USDC data (since the Composer is trusted to deliver USDC before calling).

**Mitigation**: The Composer is a trusted, audited contract. Users dealing with cross-chain flows should verify they're using the official DMF app and trusted bridge routes. Direct Base operations (`buy`/`refund`) are unaffected by Composer state.

## Stablecoin Dependency (USDC)

### USDC Depeg
dmfUSD derives its value from USDC. If USDC depegs from $1, dmfUSD will depeg proportionally.

**Mitigation**: This is the same risk as holding USDC itself. DMF does not amplify this risk. Circle's USDC is regulated, audited, and one of the most stable stablecoins.

### USDC Freeze
Circle can freeze USDC at any address, including the dmfUSD contract. This would prevent refunds until the freeze is lifted.

**Mitigation**: This is a systemic risk of all USDC-based tokens. DMF uses native USDC (not bridged) to minimize intermediary risk.

## Base Chain Risks

### Base Sequencer Failure
If the Base sequencer goes down or experiences extended downtime, users cannot interact with dmfUSD until the chain recovers.

**Mitigation**: Base is a mature L2 with established uptime. This risk applies to all Base-native applications.

### Reorgs
Chain reorganizations could affect transaction ordering. The protocol relies on standard Ethereum finality.

## User-Side Risks

### Slippage and Fee Miscalculation
Users who do not account for the 0.25% fee (capped at $20) may receive less dmfUSD than expected.

**Mitigation**: Use `previewDeposit()` and `previewRedeem()` to check exact amounts before transacting.

### Cross-Chain Mistakes
Sending dmfUSD directly to an unsupported bridge address may result in lost funds. Always use the official DMF app for cross-chain operations.

**Mitigation**: Always use the DMF UI or documented contract interfaces. Do not attempt manual cross-chain interactions with dmfUSD outside of trusted bridge protocols.

### Wallet / Phishing
Users approving malicious contracts to spend dmfUSD or USDC could lose funds.

**Mitigation**: Only approve the dmfUSD contract and trusted routers. Verify contract addresses against official sources.

## Risk Summary

| Category | Risk Level | Notes |
|----------|-----------|-------|
| Smart contract bug | Extremely Low | 308M+ tests, formal verification |
| Admin key compromise | Low | Limited powers, renounceable, 2-step ownership |
| Composer compromise | Low | Only affects cross-chain flows |
| USDC depeg | Medium | Same as holding USDC |
| USDC freeze | Low | Systemic to USDC ecosystem |
| Base chain outage | Low | All Base apps affected |
| User error | Medium | Mitigated by UI previews |

DMF is designed to minimize trust assumptions. The most material risks are those inherent to any stablecoin or L2-dependent application.
