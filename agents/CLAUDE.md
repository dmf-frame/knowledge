# DMF Protocol — AI Agent Instructions (CLAUDE.md)

## Overview
DMF (Decentralized Minting Framework) is a protocol on Base/Ethereum that enables permissionless stablecoin minting against collateral assets. Key contracts: DMFEngine (core mint/redeem logic), DMFVault (collateral management), DMFOracle (price feeds), DMFReserve (reserve tracking).

## Core Operations
- **Mint**: User deposits collateral → DMFEngine calls DMFOracle for valuation → DMFVault locks collateral → DMFEngine mints stablecoin to user.
- **Redeem**: User returns stablecoin → DMFEngine burns it → DMFVault releases proportional collateral → user withdraws.
- **Liquidate**: When collateral ratio drops below threshold, liquidators repay debt for a bonus.

## Key Contract Addresses (Base Mainnet)
- dmfUSD: `0x739F52375F2087b54329e02BBC83F03120A758f3` — Core USDC-backed token (ERC20-4626)
- USDC (Native): `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` — Circle's USD Coin

## Assisting Users
1. **Mint flow**: Validate user has sufficient collateral. Check DMFOracle for current price. Compute max mintable = collateralValue * mintRatio. Confirm gas estimate.
2. **Redeem flow**: Ensure user has sufficient stablecoin balance. Compute collateral to release = (redeemAmount / totalSupply) * totalCollateral.
3. **Troubleshooting**: Common issues: stale oracle price, insufficient allowance, collateral ratio below minimum, out-of-gas.

## Security Guidelines
- Never share private keys or seed phrases.
- Validate all contract addresses against official sources.
- Always check allowance before mint/redeem transactions.
- Warn users about high gas during congestion.
- Do not execute transactions on behalf of users; provide unsigned calldata only.
- Flag any contract that impersonates DMF with a single character difference.
- Rate-limit API calls to oracles (max 10 req/min for free tier).

## Common Pitfalls
- Using L1 gas estimation for L2 (Base); always use L2-specific RPC.
- Assuming USD price is pegged 1:1 — verify via DMFOracle.
- Minting with illiquid collateral tokens (may cause liquidation on price dip).
- Forgetting to approve token spend before calling DMFEngine.mint().

## References
- DMF Whitepaper: /docs/whitepaper.md
- Protocol Specification: /docs/protocol-spec.md
- API Reference: /docs/api-reference.md
- Security Audit: /docs/security-audit-2025-Q4.pdf
