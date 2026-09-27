---
title: "How to Use DMF"
description: "Step-by-step guide for connecting your wallet, minting dmfUSD, redeeming for USDC, and checking your balance."
audience: human
section: education
date: 2026-09-27
---

# How to Use DMF

Alright, let's get you up and running with DMF on Base. This guide walks you through everything — connecting your wallet, minting dmfUSD, sending it around, and cashing out when you need to.

## What You'll Need

Before we start, make sure you've got these three things:

- **A browser wallet extension that works on Base** — MetaMask, Rabby, Coinbase Wallet, or any other EVM wallet extension will do.
- **USDC on Base** — You can bridge it over with the external Swap & Bridge service (BlockchainBridge), or grab some on a Base exchange like Aerodrome or Uniswap.
- **A little ETH on Base** — Just enough for gas fees (think pennies per transaction).

## Step 1: Point Your Wallet at Base

1. Open your wallet app.
2. Switch the network to **Base Mainnet**.
3. If Base isn't listed, add it manually with these details:
   - **Network Name**: Base Mainnet
   - **RPC URL**: `https://mainnet.base.org`
   - **Chain ID**: `8453`
   - **Currency Symbol**: ETH
   - **Block Explorer**: `https://basescan.org`

## Step 2: Get Some USDC on Base

Don't have USDC on Base yet? No problem:

- **Bridge it**: Use the external Swap & Bridge service at `https://bridge.blockchainbridge.ai/` (dmfam.org/swap-bridge redirects you there). It is a separate service, not operated by DMF.
- **Swap for it**: Hit up a Base DEX like Aerodrome or Uniswap.
- **One thing to watch for**: Make sure you're getting **Native USDC** (the official one from Circle), not some bridged version.

## Step 3: Buy dmfUSD

This is where you trade USDC for dmfUSD.

1. Head to `https://dmfam.org` and open the buy/sell card.
2. Click **Connect Wallet** and approve the connection.
3. Type in how much USDC you want to deposit.
4. First time? You'll need to approve the DMF contract to spend your USDC — that's a one-time signature per session.
5. Hit **Buy** and confirm the transaction in your wallet.
6. Wait a few seconds for Base to confirm it.
7. Your dmfUSD balance shows up in the card and in your wallet.

> **Pro tip**: If you're the type who likes talking directly to contracts, you can also call the `buy(uint256)` function on BaseScan yourself.

## Step 4: Check Your Balance

- The buy/sell card on dmfam.org shows your dmfUSD balance.
- In your wallet, you may need to add the dmfUSD token address manually: `0x3a6f90b8517ff16b7a8c368f05f38bb03afd4aa7` on Base mainnet.

## Step 5: Send dmfUSD to Someone

dmfUSD is a standard ERC-20 token, so sending it is as easy as sending any other token:

1. Open your wallet.
2. Hit **Send** and pick dmfUSD.
3. Paste in the recipient's address.
4. Enter the amount.
5. Confirm. Done.

## Step 6: Refund dmfUSD Back to USDC

Need your USDC back? No problem — no lockup, no waiting period.

1. Go back to `https://dmfam.org` and switch the buy/sell card to the redeem direction.
2. Connect your wallet.
3. Enter how much dmfUSD you want to refund.
4. Click **Refund** and confirm the transaction.
5. USDC lands back in your wallet seconds after confirmation.

## A Few Things to Keep in Mind

- **Gas is a thing**: All operations need a tiny bit of ETH for gas. Keep a little ETH handy in your wallet.
- **Small fees**: Buying and refunding may have small fees. Check out [Understanding Fees](understanding-fees.md) for the details.
- **Interface minimums**: the buy/sell card applies a 0.1 USDC / 0.1 dmfUSD minimum. That is an interface limit only — the contract itself rejects just zero amounts, so you can always call `buy()` or `refund()` directly for smaller amounts.
- **Always redeemable**: There's no lockup. Your USDC is yours whenever you want it.

## Safety First

- Always double-check you're on the real dmfam.org site or using the correct contract address.
- Verify the contract address on BaseScan before approving anything: `0x3a6f90b8517ff16b7a8c368f05f38bb03afd4aa7`.
- Start small — test with a tiny amount first to make sure everything feels right.
