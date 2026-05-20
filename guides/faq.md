# Frequently Asked Questions

## 1. What is dmfUSD?

dmfUSD is a fully-backed digital dollar on the Base blockchain. Every dmfUSD token represents a claim on $1 of USDC sitting in an on-chain reserve. Unlike algorithmic stablecoins with complex peg mechanics, dmfUSD is refreshingly simple — it's just USDC with a small fee wrapper around it.

## 2. Is dmfUSD safe?

Short answer: we've put it through the wringer. Long answer: the contract has survived 308 million+ test scenarios with zero failures, passed Certora formal verification (7 out of 7 rules proved), and been through Slither and Aderyn static analysis with zero high-severity findings. The contract has no admin mint function, no freeze button, and no pause mechanism. That said, dmfUSD depends on USDC and Base — if either of those have problems, dmfUSD could be affected too.

## 3. How do I mint dmfUSD?

Send USDC to the dmfUSD contract and call `buy(usdcAmount)`. First you need to approve the contract to spend your USDC (one-time approval). Or use the DMF app's cross-chain feature to mint from any chain using pretty much any token.

## 4. What are the fees?

A 0.25% fee (25 basis points) applies to both buying and selling dmfUSD, capped at $20 per transaction. Of that, 90% stays in the contract as extra backing, and 10% goes to the developer wallet. There are no additional cross-chain fees beyond the standard 0.25%.

## 5. Is dmfUSD audited?

Yes, thoroughly. We've tested with Foundry (308M+ scenarios), formally verified with Certora Prover (all 7 rules pass), and run through Slither and Aderyn (zero high-severity findings). An external audit by a top-tier firm is planned for Q3 2026.

## 6. Can I lose money?

dmfUSD is fully backed by USDC, so if everything works as designed, 1 dmfUSD should always be redeemable for roughly 1 USDC (minus the 0.25% fee). The real risks are: USDC losing its peg to $1, a smart contract vulnerability (extremely unlikely given the testing), or Base going down.

## 7. How do I verify the backing?

Head to BaseScan, look up the dmfUSD contract, and call `totalAssets()` (total USDC reserves — live balance) and `totalSupply()` (total dmfUSD in circulation). Reserves will always be >= supply. You can also check `getBackingPerToken()` for the exact ratio.

## 8. Can I use dmfUSD in DeFi?

Absolutely. dmfUSD is a standard ERC-20 token with an ERC-4626 vault interface. It'll play nice with any DeFi protocol that accepts ERC-20 tokens. Just note it uses 6 decimals (matching USDC).

## 9. How does cross-chain work?

dmfUSD lives on Base. To acquire it from other chains, use the LiFi Widget or Composer (which handles swap + bridge in one transaction). To withdraw, dmfUSD gets burned on Base and the equivalent value is bridged to your destination chain via LiFi.

## 10. Is dmfUSD permissionless?

Yes. Anyone with USDC can call `buy()` and mint dmfUSD — no KYC, no whitelist, no asking for permission. Cross-chain routes through LiFi might have their own requirements, but the core contract is open to everyone.

## 11. What's the backing ratio?

It's the total USDC reserves divided by the total dmfUSD supply. Because fees add excess reserves without minting new tokens, the ratio is always at least 100% and actually grows over time as more people use the protocol.

## 12. Can the admin mint unlimited dmfUSD?

Nope. There's no admin mint function at all. The only way to create dmfUSD is through `buy()` (anyone can call it) or `buyFromComposer()` (LiFi Composer only). This is a structural invariant verified by Certora — it's mathematically guaranteed.

## 13. What chains are supported?

**Mainnet**: Base, Ethereum, Arbitrum, OP Mainnet, Polygon, Solana. **Testnet**: Arc Testnet, Ethereum Sepolia, Base Sepolia, Solana Devnet.

## 14. How do I add dmfUSD to my wallet?

Use the dmfUSD contract address `0x739F52375F2087b54329e02BBC83F03120A758f3` on Base mainnet. On other networks, check the official addresses doc. Most wallets will auto-detect the token symbol and decimals (6). You can also import it manually using the contract address.

## 15. What happens if Circle freezes USDC in the contract?

If Circle freezes the USDC held by the dmfUSD contract, redemptions would be blocked until the freeze is lifted. This is a risk that comes with any USDC-based token. DMF uses native USDC (not bridged) to minimize extra intermediary risk.
