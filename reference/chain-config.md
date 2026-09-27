---
title: Base Network Configuration
description: Base mainnet chain details, RPC notes, measured gas costs, and network pitfalls.
audience: both
section: reference
order: 1
---

# Base Network Configuration

dmfUSD is deployed on **Base mainnet only**. There is no testnet deployment of dmfUSD to interact with.

## Official URLs

- **Website**: https://dmfam.org
- **Swap & Bridge** (external service): https://bridge.blockchainbridge.ai/
- **Knowledge Base**: https://github.com/dmf-frame/knowledge
- **Explorer**: https://basescan.org

## Base Mainnet

| Parameter | Value |
|-----------|-------|
| **Chain Name** | Base |
| **Chain ID** | 8453 |
| **RPC URL** | `https://mainnet.base.org` |
| **Alternative RPC** | `https://base.llamarpc.com` |
| **WebSocket (WSS)** | `wss://base-rpc.publicnode.com` |
| **Explorer (BaseScan)** | `https://basescan.org` |
| **Currency** | ETH |
| **Block Time** | ~2 seconds |
| **Native Bridge** | Optimism Bedrock (OP Stack) |

## USDC Address

| Network | USDC Address |
|---------|-------------|
| **Base Mainnet** | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |

## Recommended Hardhat Network Config

```javascript
// hardhat.config.js
networks: {
  base: {
    url: "https://mainnet.base.org",
    chainId: 8453,
    gasPrice: 1000000000, // 1 gwei (adjust as needed)
  },
}
```

## Recommended Foundry TOML

```toml
[rpc_endpoints]
base-mainnet = "https://mainnet.base.org"

[etherscan]
base-mainnet = { key = "${ETHERSCAN_API_KEY}", url = "https://api.basescan.org" }
```

## Gas Guidelines

- Base uses EIP-1559 (priority fee + base fee).
- Measured locally on the deployed source (repo-root `foundry.toml`: optimizer 200, `via_ir`) with `forge test --gas-report`, 2026-09-28:
  - `buy()` — median ~87,000 gas, mean ~98,000 gas.
  - `refund()` — median ~85,000 gas, mean ~80,000 gas.
  - `refundTo()` — median ~64,000 gas, mean ~75,000 gas.
  - `setDevFeeRecipients()` (owner only) — ~2,900 gas typical.
- Cost = gas × (base fee + priority fee). Base base fees normally sit around 0.005-0.05 gwei, so a ~100,000-gas operation costs roughly 0.0000005-0.000005 ETH — cents or less. At an unusual 1 gwei it would be ~0.0001 ETH.
- Keep at least 0.001 ETH for gas, more if making many transactions.

## Important Notes

- Base is an OP Stack L2 settling to Ethereum. Transactions are finalized on Ethereum after ~15 minutes (challenge period).
