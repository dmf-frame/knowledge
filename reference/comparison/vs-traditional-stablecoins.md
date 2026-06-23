# dmfUSD vs Traditional Stablecoins

This comparison shows how dmfUSD differs from major stablecoins in terms of backing, transparency, and trust model.

## Comparison Table

| Aspect | dmfUSD | USDC (Circle) | USDT (Tether) | DAI (Maker) |
|--------|--------|---------------|---------------|-------------|
| **Backing type** | USDC (on-chain, ratio grows from fees) | 1:1 USD (bank reserves) | 1:1 USD (mixed reserves) | Overcollateralized (ETH, stETH, USDC) |
| **Reserve model** | Full-reserve | Fractional reserves | Fractional reserves | Overcollateralized |
| **Mint access** | Anyone with USDC | Circle-only (KYC) | Tether-only (KYC) | Anyone via CDP |
| **On-chain transparency** | ✅ Full — `totalAssets()` vs `totalSupply()` | ⚠️ Monthly attestations | ⚠️ Quarterly attestations | ✅ Full on-chain |
| **Admin keys** | None (owner can renounce) | Circle can freeze | Tether can freeze | Maker governance can freeze |
| **Fee on trade** | 0.25% ($20 cap) | None on transfer | None on transfer | Stability fee (variable) |
| **Decimals** | 6 | 6 | 6 | 18 |
| **Cross-chain** | Bridge Protocols | CCTP | Various bridges | Bridges + CCTP |
| **DeFi composability** | ERC-4626 + ERC-20 | Standard ERC-20 | Standard ERC-20 | Standard ERC-20 |
| **Liquidation risk** | ✅ None | ✅ None | ✅ None | ⚠️ Yes (CDP) |
| **Collapse risk** | ✅ None (1:1 redeemable) | ✅ Low (regulated) | ✅ Low | ✅ Low (overcollateralized) |
| **Peg mechanism** | Direct USDC redemption | Bank redemption | Bank redemption | CDP + arb bots |

## Key Differentiators

### Full-Reserve vs Fractional
dmfUSD is always fully backed by USDC held in the contract. You can verify this on-chain at any time by comparing `totalAssets()` (USDC reserves — live balance) to `totalSupply()` (dmfUSD in circulation). USDC and USDT rely on bank attestations that are published monthly or quarterly — there's always a delay between the attestation date and when you can see it.

### On-Chain Transparency
With dmfUSD, anyone can independently verify the backing ratio in real-time on BaseScan. No trust in bank auditors or monthly reports is required. The backing ratio is always >= 100% because fees accumulate as excess reserves.

### No Admin Keys
dmfUSD has no admin mint function, no token freeze capability, and no pause mechanism. Once ownership is renounced, no entity can alter the contract's core behavior. This contrasts with USDC and USDT, where Circle and Tether can freeze addresses, and DAI, where Maker governance has upgrade powers.

### Fee Model
dmfUSD charges a symmetric 0.25% fee (capped at $20) on both buy and sell. 60% of the fee, equal to 0.15% of the transaction amount, strengthens backing by increasing the reserve ratio. The remaining 40%, equal to 0.10% of the transaction amount, goes to Operations. This is different from USDC/USDT (no fees on transfer) and DAI (variable stability fees).

### Permissionless Minting
Anyone with USDC can mint dmfUSD by calling `buy()` — no KYC, no whitelist. USDC and USDT can only be minted by their issuers. DAI is permissionless but requires overcollateralized CDPs with liquidation risk.

## Summary

dmfUSD is not a replacement for USDC — it's a wrapper that adds on-chain transparency, permissionless minting, and a fee model that strengthens backing. It inherits USDC's stability while removing the dependency on off-chain attestations and issuer-level controls.
