---
title: "Glossary"
description: "Definitions of 20+ key terms used in the DMF protocol documentation."
audience: both
section: "Education"
date: 2025-05-19
---

# Glossary

### 1:1 Backing
The simple idea that every dmfUSD token is backed by exactly one USDC sitting in the contract's reserves. The total USDC balance must always be at least as much as the total dmfUSD supply. No exceptions.

### Admin Key
A special private key that can change a smart contract's behavior — upgrade it, pause it, or mess with its rules. The DMF contract has zero admin keys. No one has special powers.

### Approval
An ERC-20 feature where you give a smart contract permission to spend a certain amount of your tokens. You need to do this before minting so the DMF contract can pull USDC from your wallet.

### Base
The Ethereum Layer 2 blockchain built by Coinbase (Chain ID: 8453). It's fast, cheap, and where DMF lives. Think of it as Ethereum but with much lower gas fees.

### BaseScan
The official block explorer for Base. Think of it as a search engine for the blockchain — look up addresses, check balances, read contract data, all in your browser.

### Block Explorer
A web tool for browsing blockchain data — transactions, wallet balances, smart contract state. BaseScan is the one for Base.

### Burn
Permanently destroying tokens so they can never be used again. When you redeem dmfUSD, the contract burns them by reducing the total supply.

### Custodial
A system where a third party holds and controls your money. DMF is the opposite — non-custodial. Your funds are held by the smart contract itself, not by any company or person.

### dApp (Decentralized Application)
A web app that talks to smart contracts on a blockchain. The DMF dApp is the friendly interface for minting and redeeming dmfUSD.

### dmfUSD
The fully-backed digital dollar from the DMF protocol. An ERC-20 token on Base, always worth what it claims because it's always backed 1:1 by USDC.

### ERC-20
The standard way tokens work on Ethereum-compatible blockchains. dmfUSD follows this standard, so it works seamlessly with wallets, exchanges, and DeFi apps.

### Gas Fee
The small transaction fee you pay to get your operations processed on the blockchain. All DMF actions need gas, paid in ETH on Base.

### Immutable Contract
A smart contract that's frozen in time after deployment. No upgrades, no admin buttons, no pause switch. The DMF contract is immutable — the rules are set in stone forever.

### Invariant
A truth that must always hold. For DMF, the big one is: USDC reserves >= dmfUSD supply. If that breaks, the protocol is broken.

### Leverage
Borrowing money to try to make bigger returns. DMF explicitly does not do this — all reserves sit as plain USDC, never lent out or invested.

### Mint
Creating new dmfUSD by depositing USDC into the DMF contract. You send USDC in, you get dmfUSD out.

### Non-Custodial
You're in control, always. No one can freeze your dmfUSD, seize it, or stop you from redeeming. Not us, not anyone.

### On-Chain
Data that lives directly on the blockchain. DMF's reserves are on-chain — anyone can verify them anytime, no middlemen required.

### Redeem
The reverse of minting. You send dmfUSD back to the contract, it burns them, and you get your USDC back. Simple.

### Reserve
The pool of USDC the DMF contract holds to back every dmfUSD in circulation. Always on-chain, never lent out, never invested.

### Smart Contract
Code running on the blockchain that enforces the rules automatically. The DMF smart contract handles minting, redeeming, and keeping the reserves safe.

### Supply
The total number of dmfUSD tokens currently in circulation. Goes up when people mint, goes down when people redeem.

### Total Supply
Same as *Supply*. Just the full name.

### USDC (USD Coin)
A stablecoin from Circle, pegged to the US dollar. It's the only thing backing dmfUSD. On Base, the official address is `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`.

### Upgrade (Contract Upgrade)
Replacing a smart contract's code with new rules. DMF contracts can't be upgraded. They're permanent.
