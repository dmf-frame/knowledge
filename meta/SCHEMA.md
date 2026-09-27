---
title: KB File Format Specification
description: Defines frontmatter schema, required fields, and validation rules for all knowledge base files
audience: both
section: meta
order: 1
---

# KB File Format Specification (SCHEMA.md)

## Frontmatter Specification
Every content `.md` file in the DMF Knowledge Base MUST include YAML frontmatter with the following fields. Run `node scripts/validate-knowledge.mjs` to check.

### Required Fields
| Field | Type | Description |
|-------|------|-------------|
| `title` | string (3-200 chars) | Human-readable page title |
| `description` | string (10-500 chars) | Brief summary of file content |
| `audience` | enum | One of: `human`, `ai`, `both` |
| `section` | enum | One of: `agents`, `education`, `guides`, `meta`, `overview`, `protocol`, `reference`, `research`, `security` — must match the file's directory |

### Optional Fields
| Field | Type | Description |
|-------|------|-------------|
| `order` | integer (1-999) | Display ordering within a section |
| `date` | date | Last-modified date (ISO 8601) |
| `aliases` | string[] | Alternative file paths (for redirects) |
| `deprecated` | boolean | Mark file as deprecated (default: false) |
| `tags` | string[] | Search tags for cross-referencing |
| `version` | string | Semantic version (e.g., "1.2.0") |
| `updated` | date | Last significant update date (ISO 8601) |

## Validation Rules
1. Every content `.md` file MUST start with `---` followed by YAML frontmatter and closing `---`. Repository-level files (`README.md`, `index.md`, `CONTRIBUTING.md`) are exempt.
2. Required fields MUST NOT be empty or null.
3. `audience` MUST be exactly `human`, `ai`, or `both`.
4. `section` MUST be one of the listed section values AND match the file's top-level directory.
5. `order`, when present, MUST be an integer between 1 and 999.
6. `title` MUST be 3-200 characters.
7. `description` MUST be 10-500 characters.
8. All relative links MUST resolve to existing files.
9. No circular references between files.
10. File size MUST NOT exceed 50KB.

## Example Frontmatter
```yaml
---
title: How to Verify Backing
description: On-chain verification of full USDC reserves via BaseScan
audience: human
section: education
order: 2
tags: [backing, usdc, verification]
updated: 2026-09-28
---
```

## Link Resolution
- Relative links MUST use forward slashes.
- Anchors (#section) are allowed for same-file navigation.
- External links MUST use `https://` scheme.
- Broken links MUST be flagged during validation.
