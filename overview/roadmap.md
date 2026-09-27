---
title: "Development Roadmap"
description: "Current state of the DMF protocol, upcoming features, and long-term vision."
audience: both
section: overview
date: 2026-09-28
---

# Development Roadmap

## Where We Are Right Now

DMF is live on Base with a fully functioning mainnet deployment. You can buy dmfUSD with USDC, hold and transfer tokens, and refund back to USDC whenever you want. The core contract is immutable and verified on BaseScan — the source code is public for anyone to inspect.

Right now we're focused on stability, security, and spreading the word. The buy, refund and on-chain reserve paths are live on Base and covered by the contract test suite; no dmfUSD is in circulation yet, so the track record rests on verifiable code and reproducible tests rather than usage volume.

## Under Consideration

- **More documentation**: Growing this Knowledge Base with better guides, FAQs, and technical references.
- **Integration guides**: Step-by-step docs for wallets, DEXs, and DeFi protocols that want to support dmfUSD.
- **Analytics dashboard**: A public dashboard showing real-time reserve ratios, supply metrics, and transaction history.
- **Bug bounty program**: A formal security rewards program for anyone who finds vulnerabilities (and reports them responsibly).

## Medium-Term Goals

- **Multi-chain presence (non-committal)**: This dmfUSD contract is Base-only, frozen, and is never bridged or wrapped. Any future chain presence would be a separate deployment at a new address, not a change to this contract. No such deployment is committed.
- **Cross-chain access (non-committal)**: dmfUSD itself does not move between chains. Users who need USDC on Base use the external BlockchainBridge service, then buy on Base. No bridge or wrap of this token is planned as a change to the deployed contract.
- **Developer tooling**: SDKs and API endpoints to make it even easier for apps to integrate dmfUSD support.

## Long-Term Vision

- **Core infrastructure**: Making dmfUSD a foundational backed asset for the on-chain economy — a simple, transparent, and reliably backed digital token that anyone can verify.
- **Ecosystem growth**: Supporting third-party apps built on dmfUSD, from payment solutions to savings tools to on-chain financial products.
- **Standards development**: Helping shape industry standards for fully-backed digital assets, including best practices for verification and transparency.

## An Honest Take

DMF's strength is simplicity: transparent USDC backing, immutability, and non-custodial operation. Every decision on the roadmap reflects that philosophy.

No hard timelines — development depends on community interest, funding, and whatever the regulatory landscape throws at us. But pull requests and community contributions? Always welcome.
