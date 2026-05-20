---
title: KB Architecture Map (TELOS)
description: TELOS-style documentation of the DMF Knowledge Base organization and content
audience: both
section: meta
order: 3
---

# DMF Knowledge Base — Architecture Map

## Overview
The DMF Knowledge Base contains structured information about the Decentralized Minting Framework protocol. It is organized for consumption by both humans and AI agents, with clear frontmatter metadata for programmatic navigation.

## Section Map

| Section | File Count | Content Types | Primary Audience |
|---------|-----------|---------------|------------------|
| agents/ | 7 | Agent instructions, prompt templates, bot guides | ai |
| contracts/ | 4 | ABIs, deployment addresses, source code | ai, human |
| docs/ | 5 | Whitepaper, protocol spec, API ref, audits | human, ai |
| integrations/ | 3 | SDK wrappers, third-party connectors | human, ai |
| meta/ | 3 | Schema, changelog, architecture map | both |
| scripts/ | 2 | Validation, deployment utilities | ai |
| tests/ | 2 | Test vectors, helper utilities | ai |
| tools/ | 2 | Hardhat config, CLI references | human |

**Total: 28 files across 8 sections**

## Content Classification
- **Protocol Documentation** (`docs/`): Whitepaper, spec, API reference, audit reports
- **Smart Contracts** (`contracts/`): Source code, ABIs, deployment addresses
- **AI Resources** (`agents/`): Agent instructions, prompt templates, bot integration
- **Integration Layer** (`integrations/`): SDK wrappers, third-party connectors
- **Developer Tools** (`tools/`, `scripts/`): CLI tools, deployment scripts, validators
- **Metadata** (`meta/`): Schema definitions, changelog, architectural documentation
- **Quality Assurance** (`tests/`): Test vectors, helpers, validation

## Navigation Flow
1. **New contributors**: Start at `agents/AGENTS.md` for workspace overview.
2. **Protocol questions**: `docs/whitepaper.md` → `docs/protocol-spec.md`
3. **Integration work**: `agents/bot-integration-guide.md` → `contracts/` → `integrations/`
4. **AI/automation**: `agents/CLAUDE.md` → `agents/prompts/` → `scripts/`
5. **Validation**: `meta/SCHEMA.md` → `scripts/validate-knowledge.mjs`

## Key Design Decisions
- AI-targeted files use raw, technical language — no humanization.
- Frontmatter is required on all `.md` files for automated processing.
- Prompts are stored in a dedicated `prompts/` subdirectory for reuse.
- Scripts are executable Node.js for cross-platform compatibility.
