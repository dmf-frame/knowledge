# User Quickstart Guide

Welcome! Here's how to start using dmfUSD — a fully-backed digital dollar that's simple, transparent, and runs on Base.

## What You'll Need

- A wallet like MetaMask or Coinbase Wallet
- A little bit of ETH on Base to cover gas costs (we're talking pennies)
- USDC on Base to mint dmfUSD (or any token on any chain if you're going cross-chain)

## How to Get dmfUSD

### Option 1: Buy Direct (You already have USDC on Base)

1. Open the DMF app and connect your wallet.
2. Type in how much USDC you want to convert.
3. The app shows you a preview of what you'll receive — no surprises.
4. Your wallet will ask you to approve USDC spending (just once per session).
5. Confirm the transaction. You'll get dmfUSD in your wallet, minus a small 0.25% fee (capped at $20).

### Option 2: Buy Cross-Chain (Your tokens are on another chain)

1. Open the DMF app and connect your wallet on Arbitrum, Optimism, Ethereum, or another supported chain.
2. Pick your input token (ETH, USDC, anything supported) and enter the amount.
3. Choose dmfUSD on Base as your destination.
4. Confirm the cross-chain route — LiFi handles the bridge and swap automatically behind the scenes.
5. Receive dmfUSD on Base in one smooth transaction.

## How to Sell dmfUSD

### Option 1: Sell Direct (Get USDC back on Base)

1. In the DMF app, flip to the **Sell** tab.
2. Enter how much dmfUSD you want to sell.
3. Preview how much USDC you'll get back.
4. Confirm the transaction. USDC lands in your wallet.

### Option 2: Sell Cross-Chain (Get tokens on another chain)

1. Pick your destination chain and token (say, ETH on Arbitrum).
2. Enter the dmfUSD amount.
3. Confirm the cross-chain route — LiFi handles everything.
4. Receive your tokens on the destination chain.

## Fees at a Glance

- **Buy/Sell fee**: 0.25% of the transaction (capped at $20 max).
- **No hidden fees**: Every fee is on-chain and verifiable. What you see is what you get.

## Tips for a Smooth Experience

- Use the preview feature (`previewDeposit()` or `previewRedeem()`) in the app to see exactly what you'll get before confirming. No guesswork.
- Keep a tiny bit of ETH on Base for gas — we're talking $0.01 to $0.10 per transaction.
- dmfUSD is always fully backed by USDC. You can verify the backing ratio yourself anytime on BaseScan.

## Want to Verify the Backing Yourself?

Anyone can do this — no special access needed:

1. Go to BaseScan and look up the dmfUSD contract.
2. Call `totalAssets()` — this shows total USDC reserves (live balance).
3. Call `totalSupply()` — this shows total dmfUSD in circulation.
4. Reserves should always be >= supply. That's the promise.

Or just use the DMF app's "Verify Backing" feature for a nice friendly display.

## Need Help?

Check out the FAQ or drop into the DMF Discord and open a support ticket.
