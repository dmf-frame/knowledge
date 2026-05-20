---
title: "How to Use DMF"
description: "Step-by-step guide for connecting your wallet, minting dmfUSD, redeeming for USDC, and checking your balance."
audience: human
section: "Education"
date: 2025-05-19
---

# How to Use DMF

Alright, let's get you up and running with DMF on Base. This guide walks you through everything — connecting your wallet, minting dmfUSD, sending it around, and cashing out when you need to.

## What You'll Need

Before we start, make sure you've got these three things:

- **A wallet that works on Base** — MetaMask, Coinbase Wallet, Rainbow, or any other EVM wallet will do.
- **USDC on Base** — You can bridge it over from Ethereum or grab some on a Base exchange like Aerodrome or Uniswap.
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

- **Bridge it**: Use the official Base bridge at `https://bridge.base.org` to move USDC from Ethereum.
- **Swap for it**: Hit up a Base DEX like Aerodrome or Uniswap.
- **One thing to watch for**: Make sure you're getting **Native USDC** (the official one from Circle), not some bridged version.

## Step 3: Mint dmfUSD

This is where the magic happens — you trade USDC for dmfUSD.

1. Head to the official DMF dApp (URL to be announced).
2. Click **Connect Wallet** and approve the connection.
3. Type in how much USDC you want to deposit.
4. First time? You'll need to approve the DMF contract to spend your USDC — that's a one-time signature per session.
5. Hit **Mint** and confirm the transaction in your wallet.
6. Wait a few seconds for Base to confirm it.
7. Boom — your dmfUSD balance shows up in the dApp and in your wallet.

> **Pro tip**: If you're the type who likes talking directly to contracts, you can also call the `mint` function on BaseScan yourself.

## Step 4: Check Your Balance

- The dApp dashboard shows your dmfUSD balance front and center.
- In your wallet, you might need to add the dmfUSD token address manually (grab it from the official docs).

## Step 5: Send dmfUSD to Someone

dmfUSD is a standard ERC-20 token, so sending it is as easy as sending any other token:

1. Open your wallet.
2. Hit **Send** and pick dmfUSD.
3. Paste in the recipient's address.
4. Enter the amount.
5. Confirm. Done.

## Step 6: Redeem dmfUSD Back to USDC

Need your USDC back? No problem — no lockup, no waiting period.

1. Go back to the DMF dApp.
2. Connect your wallet.
3. Enter how much dmfUSD you want to redeem.
4. Click **Redeem** and confirm the transaction.
5. USDC lands back in your wallet seconds after confirmation.

## A Few Things to Keep in Mind

- **Gas is a thing**: All operations need a tiny bit of ETH for gas. Keep a little ETH handy in your wallet.
- **Small fees**: Minting and redeeming may have small fees. Check out [Understanding Fees](understanding-fees.md) for the details.
- **No minimums**: Mint or redeem any amount (within reason — dust thresholds apply).
- **Always redeemable**: There's no lockup. Your USDC is yours whenever you want it.

## Safety First

- Always double-check you're on the real DMF dApp or using the correct contract address.
- Verify the contract address on BaseScan before approving anything.
- Start small — test with a tiny amount first to make sure everything feels right.
