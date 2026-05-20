# Backed Token Models

This document explains what "backed tokens" are and how different models compare.

## What Is a Backed Token?

A backed token is a cryptocurrency whose value is derived from a reserve of underlying assets held by the token issuer. The issuer promises that token holders can redeem their tokens for the underlying asset at a fixed ratio (typically 1:1). The backing can be on-chain (visible on a blockchain explorer) or off-chain (held in bank accounts).

## How Reserves Work

In a backed token model:

1. A user deposits an asset (e.g., USDC, USD, ETH) into the system.
2. The system mints an equivalent amount of the backed token.
3. The deposited asset is held in a reserve.
4. The user can later return the backed token and receive the underlying asset back.

The critical question is: **what backs the token, and where is it held?**

## Types of Backed Tokens

### 1. Fully On-Chain Backed

The reserve is held in a smart contract on-chain. Anyone can verify the reserve balance at any time.

**Example**: dmfUSD (backed by USDC in an on-chain contract).
- 100% reserve ratio.
- Real-time verifiable.
- No counterparty risk from custodians.
- Dependent on the backing asset's stability.

### 2. Off-Chain (Fiat) Backed

The reserve is held in traditional bank accounts by a regulated issuer.

**Examples**: USDC (Circle), USDT (Tether).
- Issuer promises 1:1 redemption.
- Backing verified by periodic attestations from accounting firms.
- Requires trust in the issuer and auditor.
- Subject to bank and regulatory risk.

### 3. Overcollateralized (Crypto-Backed)

The reserve consists of crypto assets valued higher than the token supply.

**Example**: DAI (MakerDAO).
- Typically 150-170% collateralization.
- Maintained via CDPs (Collateralized Debt Positions).
- Liquidation risk if collateral value drops.
- No single issuer — governed by DAO.

### 4. Algorithmic (Unbacked)

No reserve. Peg maintained by algorithmic expansion/contraction of supply.

**Examples**: UST (Terra), FRAX (partially), Basis Cash.
- No reserve requirement.
- Peg relies on arbitrage and market confidence.
- Proven vulnerable to death spirals (UST collapse, 2022).
- No redemption guarantee.

## dmfUSD's Model

dmfUSD is a **fully on-chain backed token**:

- **Backing asset**: USDC (native on Base).
- **Reserve location**: The dmfUSD contract itself.
- **Reserve ratio**: Always >= 100%.
- **Verification**: Anyone can call `totalAssets()` and `totalSupply()` on-chain.
- **Fee impact**: Fees add excess reserves, increasing the backing ratio over time.

## Why This Matters

Backed tokens reduce reliance on algorithms and market mechanics for price stability. The quality of the backing determines the security of the peg:

- On-chain backing = verifiable by anyone, anytime.
- Off-chain backing = trust in issuer attestations.
- Overcollateralization = protection against volatility, but with liquidation risk.
- Algorithmic = no real backing, highest risk.

dmfUSD combines on-chain verifiability with the stability of USDC, creating a transparent and trust-minimized stable asset.
