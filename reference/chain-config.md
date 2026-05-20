# Base Network Configuration

## Official URLs

- **Website**: https://dmfam.org
- **App**: https://app.dmfam.org
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

## Base Sepolia (Testnet)

| Parameter | Value |
|-----------|-------|
| **Chain Name** | Base Sepolia |
| **Chain ID** | 84532 |
| **RPC URL** | `https://sepolia.base.org` |
| **Explorer** | `https://sepolia.basescan.org` |
| **Alternative Explorer** | `https://base-sepolia.blockscout.com` |
| **Currency** | ETH |
| **Faucet** | `https://www.coinbase.com/faucets/base-ethereum-goerli-faucet` or Base Bridge |

## USDC Addresses

| Network | USDC Address |
|---------|-------------|
| **Base Mainnet** | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| **Base Sepolia** | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |

## Recommended Hardhat Network Config

```javascript
// hardhat.config.js or foundry.toml
networks: {
  base: {
    url: "https://mainnet.base.org",
    chainId: 8453,
    gasPrice: 1000000000, // 1 gwei (adjust as needed)
  },
  baseSepolia: {
    url: "https://sepolia.base.org",
    chainId: 84532,
  },
}
```

## Recommended Foundry TOML

```toml
[rpc_endpoints]
base-mainnet = "https://mainnet.base.org"
base-sepolia = "https://sepolia.base.org"

[etherscan]
base-mainnet = { key = "${ETHERSCAN_API_KEY}", url = "https://api.basescan.org" }
base-sepolia = { key = "${ETHERSCAN_API_KEY}", url = "https://api-sepolia.basescan.org" }
```

## Gas Guidelines

- Base uses EIP-1559 (priority fee + base fee).
- Typical gas for `buy()`: ~203,000 gas (~$0.01-0.05 at 1 gwei).
- Typical gas for `refund()`: ~258,000 gas.
- Keep at least 0.001 ETH for gas, more if making many transactions.

## Important Notes

- Base is an OP Stack L2 settling to Ethereum. Transactions are finalized on Ethereum after ~15 minutes (challenge period).
