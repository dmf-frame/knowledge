---
title: Agent Workspace Configuration
description: Repository layout, navigation rules and citation conventions for AI agents working in the DMF knowledge base.
audience: ai
section: agents
order: 1
---

# DMF Knowledge Base — Agent Workspace Configuration

## Directory Structure
```
dmf-knowledge/
├── agents/       # AI agent instructions, prompts, bot + WebMCP guides
│   ├── AGENTS.md, CLAUDE.md, ai-assistant-guide.md, bot-integration-guide.md
│   ├── agent-api-quickstart.md, webmcp-tool-catalog.md, webmcp-e2e-test-agent.md
│   └── prompts/  # Reusable prompt templates (fee, security, code review)
├── overview/     # What DMF is, key concepts, architecture, roadmap
├── education/    # User-facing explainers (how-to, fees, backing, glossary)
├── guides/       # FAQ, user + developer quickstarts, deployment
├── protocol/     # Addresses, smart-contract surface, fee mechanism, invariants
├── reference/    # Base chain config, comparison/ reference material
├── security/     # Testing approach, invariant + Certora results, threat model,
│                 # registries (official-registry.json, denylist-addresses.json)
├── research/     # Historical design drafts — NOT canonical; see research/README.md
└── meta/         # SCHEMA.md, changelog.md, wrong-claims.json
```
Contract source and its tests are not vendored here — they live in the DMF-org site
repo at `app/dmftokens/` (dmfUSD.sol + test/*.t.sol).

## Navigation Reference
| Task | Files to Reference |
|------|-------------------|
| Answer protocol questions | `overview/what-is-dmf.md`, `overview/key-concepts.md`, `protocol/addresses.md` |
| Help with buy/refund | `agents/CLAUDE.md`, `protocol/fee-mechanism.md`, `protocol/invariants.md` |
| Security review | `security/threat-model.md`, `security/audit-summary.md`, `agents/prompts/security-guidelines.md` |
| Code review | `agents/prompts/code-review.md` (matches dmfUSD.sol: buy/refund, no DMFEngine) |
| Explain fees | `agents/prompts/fee-explanation.md`, `protocol/fee-mechanism.md`, `education/understanding-fees.md` |
| Bot setup | `agents/bot-integration-guide.md` |
| Scam/impersonation checks | `meta/wrong-claims.json`, `security/official-registry.json`, `research/dmf-scam-detection-rules.md` |
| Validate KB content | `scripts/validate-knowledge.mjs` |
| WebMCP e2e tests | `agents/webmcp-e2e-test-agent.md` — architecture for Playwright-based WebMCP test agent |

## Conventions
- All `.md` files include YAML frontmatter per `meta/SCHEMA.md`.
- Links use relative paths from repo root.
- No file exceeds 50KB; split large docs.
- Frontmatter fields: title, description, audience (human/ai/both), section, optional order/date/tags.
- `README.md`, `index.md` and `CONTRIBUTING.md` are repository-level files and carry no frontmatter.
- Validate before pushing: `node scripts/validate-knowledge.mjs` (exit 0 = clean).
