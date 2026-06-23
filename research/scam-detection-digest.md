# DeFi Scam Detection Patterns Digest

**Date:** 2026-06-22
**Source:** Research task for DMF /verify command in SofiaDMF_bot
**Status:** MVP findings

## 1. Contract Address Verification APIs (Etherscan/BaseScan/Blockscout)

- **Etherscan API**: 
  - Endpoint: https://api.etherscan.io/api?module=contract&action=getsourcecode&address=0x...&apikey=...
  - Returns SourceCode, ABI, ContractName, CompilerVersion, etc. If SourceCode is empty or "Contract source code not verified", it's unverified.
  - BaseScan uses same API pattern with api.basescan.org, same key works for multiple Etherscan networks.
  - Rate limits: 5 calls/sec free tier, 100k calls/day.
  - Verification status via getsourcecode or contract creation tx check.

- **Blockscout**:
  - API: https://blockscout.com/{chain}/api?module=contract&action=getsourcecode&address=...
  - Similar response, good for chains without Etherscan (or as fallback).
  - Open source, self-hostable.

- **Recommendation**: Use Etherscan/BaseScan primary (unified key), fallback to Blockscout for multi-chain. Cache results 24h. Check both "verified" flag and recent creation tx for honeypots.

## 2. MetaMask Phishing Detection Patterns

- MetaMask uses a combination of:
  - URL blocklists (integrated with phishing lists like MetaMask's own + external).
  - Domain similarity checks (typosquatting like opensea.io vs openseea.io).
  - Transaction simulation / decoding for suspicious calls (approve to unknown contracts, unlimited approvals).
  - Community reports + ML on reported phishing sites.
  - No direct contract verification in UI, but warns on unverified contracts in some flows.
  - Patterns: fake sites mimicking dApps, fake token approvals, drainers (permit signatures, setApprovalForAll).

- Key signals: domain age, SSL, redirect chains, known bad addresses in tx.

## 3. CryptoScamDB and Chainabuse Open Databases

- **CryptoScamDB** (cryptoscamdb.org):
  - Open database of reported scam addresses/domains.
  - API: https://api.cryptoscamdb.org/v1/check/{address or domain}
  - Returns risk level, reports count, categories (phishing, fake airdrop, etc.).
  - Free, community driven, good for addresses.

- **Chainabuse** (chainabuse.com):
  - Public reports of crypto abuse/scams.
  - Has API (requires key for bulk, public search available).
  - Categories: investment scam, impersonation, fake support, airdrop scam.
  - Search by address, tx hash, domain, Telegram handle.
  - Good for Telegram-related reports.

- Both provide JSON responses suitable for bot integration. Cache aggressively.

## 4. Common Telegram DeFi Scams

- **Fake Admins/Impersonation**: Bots or users with similar names/avatars to real team (e.g. "dmf_support", "DevMik_Official"). DMs users claiming "verify wallet" or "claim airdrop".
- **Fake Airdrops**: Links to fake claim sites requiring connect wallet + approve malicious contracts (unlimited ERC20 or NFT approvals).
- **Fake Support/Bridge**: Impersonate protocol support, ask for seed phrase or sign malicious tx.
- **Rug/Exit Scam signals**: New contracts with no verified source, deployer sells immediately, honeypot (can't sell tokens).
- **Other**: Pump & dump groups, fake liquidity locks, impersonated Twitter/Telegram channels.

- Detection: Check if Telegram username/handle matches known official list. Verify any linked contract address.

## 5. Best Risk Categorization (LOW/MEDIUM/HIGH/CRITICAL)

Standard 4-tier used in security/DeFi:

- **LOW**: Verified contract on Etherscan, known deployer, no reports on CryptoScamDB/Chainabuse, official docs link matches.
- **MEDIUM**: Verified but new contract (<30 days), minor anomalies (e.g. high dev allocation), no scam reports but unproven.
- **HIGH**: Unverified source, recent deploy, matches known scam patterns (e.g. same deployer as previous rugs), reports on 1+ DB.
- **CRITICAL**: Explicitly listed in CryptoScamDB/Chainabuse as scam, honeypot detected, drain contract, impersonation of official address, unlimited approval to unknown.

Use weighted score: verified? + age + DB hits + on-chain signals (ownership renounced?).

## 6. MVP Approach for /verify Command

**MVP Scope (Telegram bot /verify <address or link or tg-handle>)**:

- Parse input: detect if ETH address, URL, or @telegramuser.
- For address:
  1. Check Etherscan/BaseScan source verified.
  2. Query CryptoScamDB + Chainabuse for hits.
  3. Check creation tx age, deployer history (simple: known good/bad).
  4. Return: Risk level + short reason + links (Basescan, DB reports).
- For URL: Domain check against blocklists + similarity to known good domains.
- For TG handle: Match against known official admins list (hardcoded MVP).
- Response format (concise for voice/Telegram):
  ```
  Address: 0x6246...ce58
  Risk: LOW
  Verified: Yes (BaseScan)
  Reports: 0
  Notes: Official dmfUSD
  ```
- Tech: Python (python-telegram-bot or aiogram), async API calls, simple cache (redis or file).
- Next: Add on-chain simulation for approvals, more signals.

**Implementation Notes**:
- Start with address verification only.
- Use existing dmfUSD/deployer as seed good list.
- No ML first iteration — rule + DB based.
- Rate limit handling and error fallbacks critical.

This digest provides foundation for /verify in dmf-bot profile. Update with real API tests.