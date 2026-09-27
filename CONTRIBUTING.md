# Contributing to the DMF Knowledge Base

Thank you for your interest in contributing! This Knowledge Base is the community reference for the Digital Monetary Framework. We welcome corrections, clarifications, new guides, and translations.

## File Naming Convention

- Use lowercase kebab-case: `how-to-verify-backing.md`, `key-concepts.md`
- Place files in the appropriate section directory (`overview/`, `education/`, etc.)
- Create a new section directory if one doesn't exist for your topic

## Required Frontmatter

Every `.md` file **must** include YAML frontmatter with these fields:

```yaml
---
title: Page Title
description: One or two sentence summary of the page content.
audience: both
section: overview
order: 3
date: 2026-09-28
---
```

- **title**: Clear, descriptive title (sentence case)
- **description**: Short summary (under 200 characters)
- **audience**: `human` for end-user docs, `ai` for machine-readable reference, `both` for general content
- **section**: one of the repository's section directories (`agents`, `education`, `guides`, `meta`, `overview`, `protocol`, `reference`, `research`, `security`) — it must match the directory the file lives in
- **order**: optional; display ordering inside a section
- **date**: last-modified date (ISO 8601). Use `updated` if you prefer.

## Content Guidelines

- Write in plain English. Avoid jargon where possible; define terms when you use them.
- For technical content, include practical examples and step-by-step instructions.
- Link to other KB pages using relative paths: `[Key Concepts](overview/key-concepts.md)`
- Code snippets should be language-tagged with triple backticks.
- Keep paragraphs concise. Use bullet points and tables for structure.
- All content is MIT licensed — do not include copyrighted material.

## Pull Request Process

1. Fork the repository or create a feature branch.
2. Make your changes in a dedicated branch.
3. Run validation scripts before submitting:
   - Check that all `.md` files have valid frontmatter
   - Verify links are not broken
   - Ensure files are in the correct section directory
4. Submit a pull request with a clear description of the changes.
5. A maintainer will review and merge or request revisions.

## Validation Scripts

Run these before submitting:

```bash
# Frontmatter, section/directory match, broken links, JSON validity, file size
node scripts/validate-knowledge.mjs
```

The validator exits non-zero on any error, so it drops straight into CI. Repository-level
files (`README.md`, `index.md`, `CONTRIBUTING.md`) are exempt from frontmatter.

## Need Help?

Open a GitHub issue with questions or suggestions. We're happy to help you contribute.
