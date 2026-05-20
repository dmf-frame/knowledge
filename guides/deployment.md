# Deployment Guide

This guide walks you through deploying the DMF protocol contracts on Base — whether on mainnet or the Sepolia testnet.

## What You'll Need

### Tools to Install First
- **Foundry** (forge + cast): `curl -L https://foundry.paradigm.xyz | bash && foundryup`
- **Node.js 20+** (only if you're also running the DMF app): `nvm install 20`
- A deployer wallet loaded with enough ETH to cover gas

### Contracts & Addresses You'll Reference

| Contract | What It Does | Base Sepolia |
|----------|-------------|--------------|
| USDC | USD Coin | Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e` / Mainnet: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |

### Set Up Your Environment

Create a `.env` file with your configuration:

```env
RPC_URL=https://sepolia.base.org          # or https://mainnet.base.org
PRIVATE_KEY=0x...
USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
DEV_WALLET=0x...
TOTAL_FEE_BPS=25
MAX_VARIABLE_FEE_USDC=20000000
DEV_FEE_FRACTION=1000
```

## Step 1: Build the Contracts

```bash
cd ~/DMF-org
forge build
```

If everything compiles without errors, you're good to move on.

## Step 2: Deploy dmfUSD

The core token contract takes these parameters:

| Parameter | What It Is | Example |
|---|---|---|
| `name_` | Token name | "dmfUSD" |
| `symbol_` | Token symbol | "dmfUSD" |
| `backingToken_` | USDC contract address | `0x036CbD...` |
| `devWallet_` | Where fees go | `0x...` |
| `totalFeeBps_` | Fee in basis points | 25 (that's 0.25%) |
| `maxVariableFeeUsdc_` | Maximum fee per transaction | 20,000,000 ($20) |
| `devFeeFraction_` | Developer's share of fees | 1,000 (10%) |

**For Base Sepolia (testnet):**

```bash
forge script scripts/deploy/DeployBase.s.sol \
    --rpc-url base-sepolia \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify
```

**For Base Mainnet (production):**

```bash
forge script scripts/deploy/DeployBase.s.sol \
    --rpc-url base-mainnet \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify
```

## Step 3: Verify on BaseScan

If you passed `--verify`, Forge auto-submits your source code for verification. To do it manually:

```bash
forge verify-contract $CONTRACT_ADDRESS dmfUSD \
    --chain-id 84532 \
    --constructor-args $(cast abi-encode "constructor(string,string,address,address,uint128,uint128,uint128)" "dmfUSD" "dmfUSD" $USDC_ADDRESS $DEV_WALLET 25 20000000 1000)
```

## Step 4: Post-Deployment Setup

### Register the LiFi Composer
Needed if you're using LiFi for cross-chain swaps:

```bash
cast send $DMF_USD_ADDRESS "setComposer(address)" $COMPOSER_ADDRESS \
    --rpc-url $RPC_URL \
    --private-key $OWNER_PRIVATE_KEY
```

## Step 5: Test Everything

```bash
# Run the unit tests
forge test

# Integration test: mint some dmfUSD
cast send $DMF_USD_ADDRESS "buy(uint256)" 1000000 \
    --rpc-url $RPC_URL \
    --private-key $USER_PRIVATE_KEY

# Check the backing (live USDC balance)
cast call $DMF_USD_ADDRESS "totalAssets()" --rpc-url $RPC_URL
```

## Step 6: Renounce Ownership (For Production)

Once you've verified everything is working smoothly, renounce ownership to make the contract truly immutable:

```bash
cast send $DMF_USD_ADDRESS "renounceOwnership()" \
    --rpc-url $RPC_URL \
    --private-key $OWNER_PRIVATE_KEY
```

## Security Checklist

Before calling it done, run through this:

- [ ] Contracts deployed and verified on the block explorer
- [ ] Fee addresses configured correctly
- [ ] Composer address registered (if using LiFi)
- [ ] Ownership renounced (production only — this is permanent!)
