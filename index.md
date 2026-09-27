# DMF Knowledge Base — Full Directory Index

Complete listing of every file in the Knowledge Base, sorted by section.

---

## Section: Root

| Path | Title | Description | Audience |
|---|---|---|---|
| `/README.md` | DMF Knowledge Base Home | KB landing page with intro and quick links | both |
| `/CONTRIBUTING.md` | Contributing Guide | How to contribute, file naming, frontmatter, PR process | human |
| `/index.md` | Full Directory Index | This file — table listing every KB document | both |
| `/llms.txt` | LLM Crawler Index | Plain-text URL list of all markdown files | ai |

## Section: Overview

| Path | Title | Description | Audience |
|---|---|---|---|
| `/overview/what-is-dmf.md` | What is DMF? | High-level overview of DMF, dmfUSD, how it works | both |
| `/overview/key-concepts.md` | Key Concepts | Mint, redeem, full USDC backing, on-chain reserves, immutability | both |
| `/overview/architecture.md` | System Architecture | Smart contracts on Base, USDC integration, reserves | both |
| `/overview/roadmap.md` | Development Roadmap | Current state, upcoming features, long-term vision | both |

## Section: Education

| Path | Title | Description | Audience |
|---|---|---|---|
| `/education/how-to-use-dmf.md` | How to Use DMF | End-user guide: connect wallet, buy, refund, check balance | human |
| `/education/how-to-verify-backing.md` | How to Verify Backing | On-chain verification of full USDC reserves via BaseScan | human |
| `/education/understanding-fees.md` | Understanding Fees | Buy and refund fee model explained in simple terms | human |
| `/education/glossary.md` | Glossary | 20+ DMF terms and definitions | both |

## Section: Guides

| Path | Title | Description | Audience |
|---|---|---|---|
| `/guides/faq.md` | Frequently Asked Questions | Protocol FAQ | both |
| `/guides/for-users.md` | For Users | End-user buy, refund, and backing checks | human |
| `/guides/for-developers.md` | For Developers | Direct `buy()` / `refund()` integration | both |
| `/guides/deployment.md` | Deployment Guide | Local verification and post-deployment checks | both |

## Section: Protocol

| Path | Title | Description | Audience |
|---|---|---|---|
| `/protocol/addresses.md` | Deployed Contract Addresses | Base mainnet addresses | both |
| `/protocol/smart-contracts.md` | Smart Contract Architecture | dmfUSD contract surface and access control | both |
| `/protocol/fee-mechanism.md` | Fee Mechanism | 0.25% buy/refund fee, cap, and split | both |
| `/protocol/invariants.md` | Protocol Invariants | Properties the contract must always satisfy | both |

## Section: Security

| Path | Title | Description | Audience |
|---|---|---|---|
| `/security/audit-summary.md` | Security Summary (in-house) | Foundry test results, Certora rules, static analysis | both |
| `/security/testing-approach.md` | Security Testing Approach | In-house testing and exploit-canary methodology | both |
| `/security/invariants-testing.md` | Foundry Invariant Test Results | Real fuzz and invariant names and counts | both |
| `/security/certora-verification.md` | Certora Formal Verification | Math and system specs (10 checks) | both |
| `/security/threat-model.md` | Threat Model | Current dmfUSD risks | both |
| `/security/official-registry.json` | Official Registry | Canonical contract, domains, and channels | both |
| `/security/denylist-addresses.json` | Denylist Addresses | Known-bad addresses list | both |

## Section: Reference

| Path | Title | Description | Audience |
|---|---|---|---|
| `/reference/chain-config.md` | Base Network Configuration | Official URLs and Base network details | both |
| `/reference/comparison/backed-token-models.md` | Backed Token Models | How backed-token models compare | both |
| `/reference/comparison/vs-traditional-stablecoins.md` | dmfUSD vs Traditional Stablecoins | Backing, transparency, and trust model | both |
| `/reference/comparison/common-defi-mechanics-and-risks.md` | Common DeFi Mechanics and Structural Risks | Educational DeFi mechanism and risk notes | both |

## Section: Agents

| Path | Title | Description | Audience |
|---|---|---|---|
| `/agents/AGENTS.md` | Agent Workspace Configuration | KB layout and navigation for agents | ai |
| `/agents/agent-api-quickstart.md` | DMF Mentor Agent API | Read-only registry/contract verification snippet (design — no public deployment yet) | ai |
| `/agents/CLAUDE.md` | Agent instructions | Primary agent instructions for this KB | ai |
| `/agents/ai-assistant-guide.md` | AI Assistant Guide | Protocol context snippet and instructions for AI assistants | ai |
| `/agents/bot-integration-guide.md` | Bot Integration Guide | Setting up DMF bot channels (Telegram, web) | both |
| `/agents/agent-api-quickstart.md` | DMF Mentor Agent API | Read-only registry verification snippet | ai |
| `/agents/webmcp-tool-catalog.md` | WebMCP Tool Catalog | The WebMCP tools on dmfam.org (7 registered, site_ask_support parked) — safety tiers, schemas, example workflows | ai |
| `/agents/webmcp-e2e-test-agent.md` | WebMCP E2E Test Agent Architecture | Architecture for Playwright-based WebMCP tests | ai |
| `/agents/prompts/code-review.md` | DMF Code Review Prompt | Reusable code-review prompt | ai |
| `/agents/prompts/fee-explanation.md` | DMF Fee Explanation Prompt | Reusable fee-explanation prompt | ai |
| `/agents/prompts/security-guidelines.md` | DMF Security Review Prompt | Reusable security-review prompt | ai |

## Section: Meta

| Path | Title | Description | Audience |
|---|---|---|---|
| `/meta/SCHEMA.md` | KB File Format Specification | Frontmatter schema and validation rules | both |
| `/meta/changelog.md` | DMF Knowledge Base Changelog | Version history for this KB | both |
| `/meta/wrong-claims.json` | Wrong Claims | Patterns and corrections for false protocol claims | both |

## Section: Research

Historical design drafts. Not canonical — for current facts always use
`overview/`, `protocol/` and `security/` (see `/research/README.md`).

| Path | Title | Description | Audience |
|---|---|---|---|
| `/research/README.md` | Research Folder Notes | Why these drafts are historical and how to use them | ai |
| `/research/agent-api-design-digest.md` | Agent API Design Digest | Bot-facing API patterns for DMF Mentor | ai |
| `/research/agent-for-agents-digest.md` | Agent-for-Agents Digest | Agent-first protocol patterns | ai |
| `/research/correction-engine-digest.md` | Correction Engine Digest | Truth-firewall / correction patterns | ai |
| `/research/dmf-mentor-agent-api-design.md` | DMF Mentor Agent API Design | Draft API specification | ai |
| `/research/dmf-mentor-api-next-steps.md` | DMF Mentor API Next Steps | Implementation notes (draft) | ai |
| `/research/dmf-mentor-correction-engine.md` | DMF Mentor Correction Engine | Draft correction-engine spec | ai |
| `/research/dmf-mentor-grok-build-prompt.md` | DMF Mentor Build Prompt (long) | Long-form build prompt | ai |
| `/research/dmf-mentor-grok-build-short.md` | DMF Mentor Build Prompt (short) | Condensed build prompt | ai |
| `/research/dmf-mentor-next-steps-3.md` | DMF Mentor Phase 3 Next Steps | Phase 3 delivery notes (draft) | ai |
| `/research/dmf-mentor-roadmap-v2.md` | DMF Mentor Roadmap v2 | Scoping notes (DMF-only) | ai |
| `/research/dmf-scam-detection-rules.md` | DMF Scam Detection Rules | Address/domain/claim classification rules | ai |
| `/research/scam-detection-digest.md` | Scam Detection Digest | DeFi scam pattern digest | ai |
| `/research/social-monitoring-digest.md` | Social Monitoring Digest | Impersonation monitoring patterns | ai |

## Section: Scripts

| Path | Title | Description | Audience |
|---|---|---|---|
| `/scripts/validate-knowledge.mjs` | KB Validator | Frontmatter, section/directory, link, JSON and size checks | ai |
| `/scripts/denylist.txt` | Denylist Source | Plain-text denylist feed | ai |
