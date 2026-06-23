# Deployment Guide

This guide covers local deployment verification steps for current dmfUSD documentation. Do not publish private keys, RPC secrets, or deployment credentials.

## Verify Contract

```bash
forge verify-contract $CONTRACT_ADDRESS dmfUSD     --chain-id 8453
```

## Post-Deployment Checks

```bash
# Run unit and invariant tests
forge test

# Integration check: buy dmfUSD
cast send $DMF_USD_ADDRESS "buy(uint256)" 1000000     --rpc-url $RPC_URL     --private-key $USER_PRIVATE_KEY

# Check live backing
cast call $DMF_USD_ADDRESS "totalAssets()" --rpc-url $RPC_URL
```

## Production Checklist

- [ ] Contract deployed and verified on block explorer
- [ ] USDC address verified
- [ ] Fee recipient addresses configured correctly
- [ ] Direct buy/refund tested
- [ ] Live backing checks return expected values
- [ ] Ownership posture documented before launch
- [ ] No private keys or secrets committed
