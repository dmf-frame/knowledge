---
title: "How to Verify Backing"
description: "Step-by-step instructions for independently verifying that dmfUSD is fully backed by USDC on-chain (at least 1:1, growing over time)."
audience: human
section: education
date: 2026-09-28
---

# How to Verify Backing

Here's the cool part about DMF: you don't have to take anyone's word that dmfUSD is fully backed. You can check it yourself, right now, on the blockchain. This guide shows you exactly how.

## What We're Checking

Two simple numbers:

1. **Total supply of dmfUSD** — how many tokens exist right now.
2. **USDC balance of the DMF contract** — how much USDC the contract holds.

The rule: the USDC balance must be greater than or equal to the dmfUSD total supply. That's it.

**Current state:** dmfUSD has no circulating supply and the contract holds no USDC (totalSupply 0, USDC 0), so the rule holds trivially today and starts biting at the first buy.

## Let's Do It Step by Step

### Step 1: Find the Contract Addresses

First, grab the official DMF contract address from a trusted source — the DMF website, this Knowledge Base, or the team's official channels. You'll also need the USDC address on Base.

Here's what you're looking for:
- **DMF Contract**: `0x3a6f90b8517ff16b7a8c368f05f38bb03afd4aa7` (Base mainnet — the only dmfUSD deployment; [view on BaseScan](https://basescan.org/address/0x3a6f90b8517ff16b7a8c368f05f38bb03afd4aa7))
- **USDC on Base**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` (Circle's official USDC)

### Step 2: Check How Many dmfUSD Tokens Exist

1. Go to `https://basescan.org` and search for the DMF contract address.
2. Click the **Contract** tab, then **Read Contract**.
3. Find the **`totalSupply()`** function and hit **Query**.
4. Write down the number you see. That's the total dmfUSD in circulation (shown with 6 decimal places, matching USDC).

### Step 3: Check How Much USDC the Contract Holds

1. Go to `https://basescan.org` and search for the USDC contract address.
2. Click **Contract**, then **Read Contract**.
3. Find **`balanceOf(address)`**.
4. Paste in the DMF contract address and hit **Query**.
5. Write that number down. It's the USDC the contract controls (with 6 decimal places).

### Step 4: Compare the Two Numbers

Convert them to readable numbers:

- dmfUSD total supply → divide by 10^6
- USDC balance → divide by 10^6

**The USDC balance should be equal to or greater than the dmfUSD supply.**

### Example

```
dmfUSD total supply: 1,000,000,000 → 1,000 dmfUSD
USDC balance:       1,000,000,000 → 1,000 USDC

Ratio: 1:1 ✓  Fully backed (and will grow over time as fees accumulate).
```

## Easier Way: Check the dApp

The quickest check reads the same on-chain values the protocol API exposes:

1. Open the official DMF dApp.
2. Look for the **Reserves** or **Backing** section.
3. You'll see:
   - Current dmfUSD total supply
   - Current USDC reserves
   - Backing ratio
4. Cross-check those numbers on BaseScan if you want to be extra sure.

## For the Technical Crowd: A Script

Want to verify programmatically? Here's a quick snippet using Ethers.js:

```javascript
const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
const usdc = new ethers.Contract('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', [
  'function balanceOf(address) view returns (uint256)'
], provider);
const dmf = new ethers.Contract(DMF_ADDRESS, [
  'function totalSupply() view returns (uint256)'
], provider);

const supply = await dmf.totalSupply();
const reserves = await usdc.balanceOf(DMF_ADDRESS);
const ratio = supply === 0n ? null : (Number(reserves) / Number(supply)) * 100;
console.log('Backing ratio:', ratio === null ? 'n/a (no supply yet)' : ratio.toFixed(2) + '%');
```

## How Often Should You Check?

As often as you like! The blockchain doesn't sleep. The backing ratio changes whenever either side of it moves — someone buys or refunds, or USDC is sent straight to the contract (any USDC sent directly to the contract counts as backing, no mint needed). So you can check once and feel confident — or check every hour if that's your thing.

## What If the Ratio Is Off?

If you ever find that the USDC balance is *less* than the dmfUSD total supply, that's a serious problem. Here's what to do:

1. Screenshot everything. Get the transaction hashes.
2. Report it to the DMF community through official channels immediately.
3. Don't mint or buy any more dmfUSD until things are sorted.

**Good news**: this has never happened. Not once. The invariant has held since day one.
