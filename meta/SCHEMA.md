---
title: KB File Format Specification
description: Defines frontmatter schema, required fields, and validation rules for all knowledge base files
audience: both
section: meta
order: 1
---

# KB File Format Specification (SCHEMA.md)

## Frontmatter Specification
Every `.md` file in the DMF Knowledge Base MUST include YAML frontmatter with the following fields.

### Required Fields
| Field | Type | Description |
|-------|------|-------------|
| `title` | string (3-200 chars) | Human-readable page title |
| `description` | string (10-500 chars) | Brief summary of file content |
| `audience` | enum | One of: `human`, `ai`, `both` |
| `section` | enum | One of: `agents`, `contracts`, `docs`, `integrations`, `meta`, `scripts`, `tests`, `tools` |
| `order` | integer (1-999) | Display ordering within section |

### Optional Fields
| Field | Type | Description |
|-------|------|-------------|
| `aliases` | string[] | Alternative file paths (for redirects) |
| `deprecated` | boolean | Mark file as deprecated (default: false) |
| `tags` | string[] | Search tags for cross-referencing |
| `version` | string | Semantic version (e.g., "1.2.0") |
| `updated` | date | Last significant update date (ISO 8601) |

## Validation Rules
1. Every `.md` file MUST start with `---` followed by YAML frontmatter and closing `---`.
2. Required fields MUST NOT be empty or null.
3. `audience` MUST be exactly `human`, `ai`, or `both`.
4. `section` MUST be one of the listed section values.
5. `order` MUST be an integer between 1 and 999.
6. `title` MUST be 3-200 characters.
7. `description` MUST be 10-500 characters.
8. All relative links MUST resolve to existing files.
9. No circular references between files.
10. File size MUST NOT exceed 50KB.

## Example Frontmatter
```yaml
---
title: Mint Operation Guide
description: Step-by-step guide for minting stablecoins via DMFEngine
audience: human
section: docs
order: 5
tags: [mint, stablecoin, collateral]
version: 1.0.0
updated: 2026-01-15
---
```

## Link Resolution
- Relative links MUST use forward slashes.
- Anchors (#section) are allowed for same-file navigation.
- External links MUST use `https://` scheme.
- Broken links MUST be flagged during validation.
