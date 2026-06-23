---
title: DMF Bot Integration Guide
description: Technical guide for monitoring and information bots for current dmfUSD support
audience: ai
section: agents
order: 4
---

# DMF Bot Integration Guide

## Overview

This guide covers read-only monitoring and information bots for the current dmfUSD model.

Current dmfUSD does not use a legacy collateralized-debt automation model.

## Supported Bot Types

### 1. Reserve Monitor Bot

- Reads the dmfUSD contract USDC balance.
- Reads dmfUSD `totalSupply()`.
- Computes backing ratio as `USDC.balanceOf(dmfUSD) / totalSupply`.
- Alerts only on unexpected data or RPC failures, not liquidation thresholds.

### 2. Information Bot

- Answers support questions from current DMF Knowledge docs.
- Explains buy, refund, backing, fees, contract addresses, and verification.
- Does not hold private keys.
- Does not execute transactions for users.

### 3. Route Monitor Bot

- Monitors multi-chain route availability if connected to the app/API.
- Reports live route fees and chain/token availability from the live source.
- Does not invent chain counts, token support, or route costs.

## Security

- Keep API keys in environment variables or a secret manager.
- Never log private keys, seed phrases, or user secrets.
- Use read-only RPC access wherever possible.
- For any transaction-capable bot, use a dedicated wallet with limited funds and explicit human approval.

## Unsupported For Current dmfUSD

Do not build or describe:

- legacy collateralized-debt automation,
- price-feed maintenance bots,
- debt-position monitors.
