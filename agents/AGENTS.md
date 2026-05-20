# DMF Knowledge Base — Agent Workspace Configuration

## Directory Structure
```
dmf-knowledge/
├── agents/           # AI agent instructions, prompts, bot guides
│   ├── CLAUDE.md           # Primary agent instructions (for Claude/LLMs)
│   ├── AGENTS.md           # This file — workspace navigation
│   ├── ai-assistant-guide.md    # Guide for AI assistants
│   ├── bot-integration-guide.md # Bot setup and integration
│   └── prompts/             # Reusable prompt templates
│       ├── fee-explanation.md
│       ├── security-guidelines.md
│       └── code-review.md
├── contracts/        # Smart contract source & ABIs
├── docs/             # Protocol documentation, whitepapers
├── integrations/     # Third-party integration guides
├── meta/             # KB metadata, schema, changelog, architecture
├── scripts/          # Validation, deployment, utility scripts
├── tests/            # Test vectors and test helpers
└── tools/            # CLI tools and SDK references
```

## Navigation Reference
| Task | Files to Reference |
|------|-------------------|
| Answer protocol questions | `docs/protocol-spec.md`, `docs/whitepaper.md` |
| Help with mint/redeem | `agents/CLAUDE.md`, `contracts/DMFEngine.json` |
| Security review | `agents/prompts/security-guidelines.md` |
| Code review | `agents/prompts/code-review.md` |
| Explain fees | `agents/prompts/fee-explanation.md` |
| Bot setup | `agents/bot-integration-guide.md` |
| Deploy contracts | `scripts/deploy.mjs`, `tools/hardhat.config.js` |
| Test interactions | `tests/test-vectors.json`, `scripts/validate-knowledge.mjs` |

## Conventions
- All `.md` files include YAML frontmatter per `meta/SCHEMA.md`.
- Links use relative paths from repo root.
- No file exceeds 50KB; split large docs.
- Frontmatter fields: title, description, audience (human/ai/both), section, order.
