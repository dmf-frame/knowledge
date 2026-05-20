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
title: "Page Title"
description: "One or two sentence summary of the page content."
audience: human | ai | both
section: "Section Name"
date: YYYY-MM-DD
---
```

- **title**: Clear, descriptive title (sentence case)
- **description**: Short summary (under 200 characters)
- **audience**: `human` for end-user docs, `ai` for machine-readable reference, `both` for general content
- **section**: One of: Overview, Education, Reference, Contributing
- **date**: Last-modified date in ISO 8601 format

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
# Check frontmatter on all files
python3 scripts/validate_frontmatter.py

# Check for broken internal links
python3 scripts/validate_links.py

# Verify index.md matches actual files
python3 scripts/update_index.py --check
```

If these scripts don't exist yet in the repository, you can create them or run a manual review against the guidelines above.

## Need Help?

Open a GitHub issue with questions or suggestions. We're happy to help you contribute.
