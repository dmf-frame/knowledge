# DMF Scam Detection Rules Specification

**Version:** 0.9  
**Date:** 2026-06-22  
**Scope:** DMF Mentor only — exclusively for DMF (Digital Monetary Framework), dmfam.org, and the dmfUSD token.  
**Purpose:** Define precise, enforceable rules for the `/verify` command, scam pattern recognition, risk classification, and response generation. These rules protect DMF users and maintain the integrity of DMF Mentor as the single source of truth.

---

## 1. Official DMF Registry (Ground Truth)

DMF Mentor must maintain and reference an authoritative, version-controlled registry of legitimate assets. Any deviation triggers elevated scrutiny.

### Core Contracts (Base Mainnet)
| Asset              | Address                                      | Type                  | Verification Notes |
|--------------------|----------------------------------------------|-----------------------|--------------------|
| dmfUSD             | `0x624624fd3821d5f4f8f799369727f08d8219ce58` | ERC-20 Token          | Primary token. Immutable backing mechanics. |
| Dev Vault          | `0x9D32eaF6a0dFCD89bBD18B3F8c90fE5936535736` | Protocol Vault        | Critical for backing and fee distribution. |
| Deployer / Admin   | `0x7737a61b52aD6fc02662A3cC79C57FeBFB089a2E` | EOA / Multi-sig       | Initial deployment address. Monitor for impersonation. |

**Rule:** Any contract claiming to be dmfUSD or a DMF core component **must** match the above addresses exactly. Mismatches = HIGH or CRITICAL risk.

### Official Domains & Interfaces
- Primary: `https://dmfam.org`
- Application: `https://app.dmfam.org`
- Subpaths: `/white-paper`, `/security`, `/about`

**Rule:** Only these exact domains (and verified subdomains) are legitimate. Any variation (dmfam-app.com, dmfam-claim.net, etc.) is fraudulent.

### Official Communication Channels (for impersonation detection)
- X / Twitter: Official handle(s) as maintained in DMF knowledge base (currently referenced as @dmf_frame in project context).
- Telegram: Official DMF group/channel (to be confirmed and pinned in knowledge base).
- No official support will ever DM users first asking for wallet connection, seed phrases, or approvals.

**Maintenance:** The registry lives in the DMF knowledge Git. Updates require explicit review. DMF Mentor must surface when it is using a cached vs. latest registry version.

---

## 2. Scam Categories and Detection Rules

### Category A: Fake Token Contracts (Highest Volume Threat)
**Description:** Cloned or malicious ERC-20 contracts using "dmfUSD", "DMF USD", or similar names/symbols.

**Detection Rules:**
1. Address does **not** exactly match the official dmfUSD address above.
2. Contract name/symbol contains "dmfUSD", "DMF", or close variants but fails address match.
3. Contract lacks the documented dmfUSD mechanics (growing USDC backing, no liquidation, immutable reserves, specific fee allocation to vault/NFTs/treasury).
4. Source code (if verified) does not match the expected immutable, non-custodial, full-reserve design described in the DMF whitepaper and SOUL.md.
5. Deployed by an address with no historical connection to the official deployer in the registry.

**Risk Level:** 
- Exact name/symbol match + wrong address → **CRITICAL**
- Similar name + no backing mechanics → **HIGH**

**Response Trigger:** Immediate warning + link to official dmfUSD contract on BaseScan + recommendation to revoke any approvals.

### Category B: Phishing & Drainer Sites / Fake Interfaces
**Description:** Malicious websites mimicking dmfam.org or app.dmfam.org to steal approvals, private keys, or seed phrases.

**Detection Rules:**
1. Domain is **not** exactly `dmfam.org` or `app.dmfam.org`.
2. URL contains typosquatting (dmfam0rg, dmfam-app, claim-dmf, etc.).
3. Page requests wallet connection for "verification", "airdrop claim", "reward distribution", "bridge migration", or "Mentor access".
4. Page asks for seed phrase, private key, or unlimited token approvals.
5. Visual design closely copies dmfam.org but uses different domain or has suspicious elements (wrong favicon, broken SSL, etc.).

**Risk Level:** 
- Any wallet connection request on non-official domain → **CRITICAL**
- Typosquatting domain → **HIGH**

**Response Trigger:** Strongest possible warning. Advise user to close tab immediately and check URL bar. Never approve tokens to unknown contracts.

### Category C: Impersonation of Admins, Support, or Official Accounts
**Description:** Fake X/Telegram accounts pretending to be DMF team, moderators, or "official support".

**Detection Rules:**
1. Account handle is similar but not identical to official handle (e.g., @dmf_framee, @DMFsupport_official, @dmf_verify).
2. Profile picture is copied or very close to official branding.
3. Messages originate from DMs (official channels rarely initiate sensitive actions via DM).
4. Content promises exclusive access, airdrops, "DMF Mentor verification", early features, or compensation for "bugs".
5. Urgency language: "limited time", "claim before snapshot", "connect now or lose access".

**Risk Level:** 
- Impersonation + request for wallet interaction or funds → **CRITICAL**
- Impersonation without immediate action request → **HIGH**

**Response Trigger:** "This is not an official DMF account. Official support never asks you to connect your wallet or share seed phrases in DMs."

### Category D: Fake Airdrops, Rewards, and "Claim" Scams
**Description:** Promises of free dmfUSD, NFT rewards, or token distributions that require wallet connection or payment of "gas fees" in advance.

**Detection Rules:**
1. Message or site claims users must "verify holdings", "connect to claim", or "pay small gas fee to unlock rewards".
2. No such airdrop or reward distribution is documented in the official DMF knowledge base or recent verified announcements.
3. Link leads to non-official domain.
4. Contract being approved is not the official dmfUSD or Dev Vault.

**Risk Level:** **HIGH** to **CRITICAL** depending on urgency and requested action.

**Response Trigger:** "DMF does not conduct airdrops via unsolicited links or third-party claim sites. All official distributions (if any) will be announced through verified channels and executed via transparent on-chain mechanics."

### Category E: Misinformation Enabling Scams
**Description:** False technical claims about dmfUSD that create confusion and make users vulnerable (often spread to justify fake sites or "upgrades").

**Examples of False Claims (cross-referenced with Correction Engine):**
- "dmfUSD is algorithmic / has liquidation mechanics"
- "You must migrate to a new dmfUSD contract"
- "dmfUSD has a fixed 1:1 peg that can break"
- "DMF uses oracles for pricing/collateral"
- "Connect your wallet to the new secure bridge to protect your funds"

**Detection Rules:**
1. Claim contradicts the documented mechanics in the DMF whitepaper, SOUL.md, or knowledge base (immutable full-reserve USDC backing, no liquidation, growing collateral via fees, deterministic on-chain rules).
2. Claim is used to justify connecting to a non-official contract or site.

**Risk Level:** **MEDIUM** to **HIGH** (escalates if paired with action request).

**Response Trigger:** Direct correction + link to authoritative source + warning that acting on the false claim may lead to loss of funds.

---

## 3. Risk Classification Matrix

| Risk Level | Criteria                                      | Recommended User Action                  | DMF Mentor Response Tone      |
|------------|-----------------------------------------------|------------------------------------------|-------------------------------|
| LOW        | Matches official registry exactly            | Safe to proceed with normal usage        | Informational / Confirmatory  |
| MEDIUM     | Minor anomalies (e.g., similar name, old info) | Verify independently via official sources | Cautionary                    |
| HIGH       | Clear impersonation or non-official domain   | Do not interact; revoke approvals        | Strong warning                |
| CRITICAL   | Active drain/phishing attempt or fake contract with matching branding | Immediately close/revoke; report        | Urgent, direct, protective    |

**Escalation Rule:** Any interaction that requests seed phrases, unlimited approvals to unknown contracts, or payment to "claim" rewards defaults to **CRITICAL**.

---

## 4. /verify Command Behavior (Core Implementation)

### `/verify <contract_address>`
**Logic:**
1. Normalize address (checksum).
2. Exact match against official registry?
   - Yes → LOW risk. Return: "Verified official DMF contract. [Brief description]. Backing and mechanics are immutable."
3. Name/symbol contains "dmfUSD" / "DMF" but address mismatch?
   - Yes → CRITICAL. "This is **not** the official dmfUSD contract. Official address: 0x6246...ce58. Do not interact."
4. No name match but user suspects it is DMF-related?
   - Return risk assessment + recommendation to cross-check against official registry.
5. Always include: Link to BaseScan page + short explanation of why it is or is not trusted.

### `/verify <url_or_domain>`
**Logic:**
1. Extract domain.
2. Exact match to `dmfam.org` or `app.dmfam.org`?
   - Yes → LOW. Confirm safe.
3. Typosquatting or similar?
   - HIGH/CRITICAL. "This domain is not affiliated with DMF. Do not connect your wallet."
4. Requests wallet connection on page load or via prominent CTA?
   - Escalate to CRITICAL with specific warning.

### `/verify` (no argument)
Return quick reference: official addresses + domains + "Never share seed phrases or approve unknown contracts."

**Machine-Readable Output (for Agent API consumers):**
```json
{
  "query": "0x...",
  "risk": "CRITICAL",
  "is_official": false,
  "reason": "Address does not match official dmfUSD contract",
  "recommended_action": "revoke_approvals",
  "official_reference": "0x624624fd3821d5f4f8f799369727f08d8219ce58",
  "sources": ["dmf-knowledge/contracts.md", "basescan"]
}
```

---

## 5. False Positive Mitigation

- Maintain an explicit allow-list of known good contracts and domains.
- Require multiple independent signals before escalating to CRITICAL (e.g., wrong address + name match + wallet request).
- Allow users to report false positives via a structured command; log for human review and registry updates.
- Version the detection rules alongside the knowledge base so improvements are auditable.

---

## 6. Integration with Other DMF Mentor Components

- **Correction Engine (Phase 3):** Misinformation scams feed directly into the correction engine. False technical claims trigger both a scam warning and a factual correction.
- **Social Monitoring (Phase 4):** Flagged impersonation accounts and phishing links discovered via monitoring are added to detection rules.
- **Agent API (Phase 2):** `/verify-address` and `/verify-link` endpoints expose these rules to other bots and wallets in structured JSON.
- **Sofia (Telegram):** Uses the same ruleset for natural language responses to user reports of suspicious activity.

---

## 7. Implementation & Maintenance Recommendations

1. **Registry Storage:** Store the official registry in the DMF knowledge Git as structured Markdown/JSON (easy to parse and audit).
2. **Update Process:** Any change to contracts, domains, or high-risk patterns requires a pull request + review. DMF Mentor should expose the last registry update timestamp.
3. **Performance:** Keep the core ruleset lightweight (exact string/address matches + simple heuristics) so `/verify` responds instantly.
4. **Extensibility:** Design rules as composable modules so new scam vectors (e.g., new impersonation patterns) can be added without rewriting the entire engine.
5. **Testing:** Maintain a test suite of known scam examples and official cases to prevent regression.

---

## Summary

These rules establish DMF Mentor as a **proactive defense layer** for the DMF ecosystem. By focusing exclusively on DMF assets and mechanics, the detection system remains precise, low-noise, and highly actionable. Combined with the Correction Engine and Monitoring Layer, it forms a robust "truth and safety" perimeter around dmfUSD and dmfam.org.

**Next Recommended Actions:**
- Implement the `/verify` command in Sofia using the above logic.
- Populate the official registry with any additional verified contracts or social handles.
- Begin drafting the machine-readable schemas for the Agent API endpoints that will expose this capability to other agents.

This specification is ready for review and implementation. All rules are grounded in the documented DMF mechanics and the explicit scope of DMF Mentor. 

**End of DMF Scam Detection Rules Specification**