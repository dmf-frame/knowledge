---
title: DMF Bot Integration Guide
description: Technical guide for setting up bots to interact with the DMF protocol
audience: ai
section: agents
order: 4
---

# DMF Bot Integration Guide

## Overview
This guide covers setting up automated bots to monitor and interact with the DMF protocol. Supported bot types: monitoring bots, liquidation bots, arbitrage bots, and information bots.

## Prerequisites
- Node.js 18+ or Python 3.10+
- Web3 provider (Base Mainnet RPC URL)
- DMF contract ABIs from `/contracts/`
- Ethers.js v6 or Web3.py v6

## Quick Start (Node.js)

```javascript
import { ethers } from 'ethers';
import DMFEngineABI from './contracts/DMFEngine.json' assert { type: 'json' };

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const engine = new ethers.Contract(
  '0xA1b2C3d4E5f6...', // DMFEngine address
  DMFEngineABI,
  provider
);

// Monitor reserve ratio
engine.on('Mint', (user, amount, collatType) => {
  console.log(`Mint: ${ethers.formatEther(amount)} by ${user}`);
});
```

## Bot Types

### 1. Reserve Monitor Bot
- Polls `DMFReserve.getReserveRatio()` every 60s
- Alerts if ratio drops below 110%
- Logs historical ratio data
- Rate limit: 1 req / 10s to avoid RPC throttling

### 2. Liquidation Bot
- Monitors positions via `DMFEngine.positions(address)`
- Waits for collateral ratio < liquidation threshold
- Calls `DMFEngine.liquidate(positionId)` when profitable
- Requires pre-funded wallet with stablecoin for repayment
- Gas estimation: use `eth_estimateGas` on Base L2

### 3. Information Bot (Telegram/Discord)
- Responds to commands: /mint, /redeem, /ratio, /price, /fees
- Fetches live data from contract read functions
- Does NOT hold private keys — read-only
- Caches responses for 30s to reduce RPC calls

### 4. Arbitrage Bot
- Monitors DMF stablecoin price vs DEX pools
- Executes mint → DEX sell or DEX buy → redeem
- Requires sandwich-protection and MEV awareness

## Error Handling
- RPC errors: retry with exponential backoff (1s, 2s, 4s, max 30s)
- Contract reverts: parse reason string, log, do not retry
- Stale oracle: skip until next price update event

## Security
- API keys and private keys in environment variables only
- Use dedicated wallets with limited funds for operational bots
- Monitor bot wallet balances and auto-pause below threshold
- All transactions should include a safety check (max gas, max slippage)

## Testing
- Use Base Sepolia testnet first
- Test vectors in `/tests/test-vectors.json`
- Dry-run mode: set `DRY_RUN=true` to log transactions without sending
