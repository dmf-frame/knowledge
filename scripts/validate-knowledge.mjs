#!/usr/bin/env node

/**
 * DMF Knowledge Base Validation Script
 * Checks: required frontmatter fields, section/directory match, relative link
 *         resolution, JSON parseability, file size.
 * Usage: node scripts/validate-knowledge.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KB_ROOT = path.resolve(__dirname, '..');

// Required on every content file. `order` is optional (ordering within a section).
const REQUIRED_FRONTMATTER = ['title', 'description', 'audience', 'section'];
const OPTIONAL_FRONTMATTER = ['order', 'date', 'updated', 'tags', 'version', 'aliases', 'deprecated'];
const VALID_AUDIENCES = ['human', 'ai', 'both'];
// Must match the real top-level content directories of this repository.
const VALID_SECTIONS = [
  'agents', 'education', 'guides', 'meta', 'overview',
  'protocol', 'reference', 'research', 'security',
];
// Repository-level files that describe the KB itself, not KB content.
const ROOT_EXEMPT = ['README.md', 'index.md', 'CONTRIBUTING.md'];
const MAX_FILE_SIZE = 50 * 1024; // 50KB
const EXCLUDED_DIRS = ['node_modules', '.git', '.env'];

const errors = [];
const warnings = [];

function isExcluded(filePath) {
  return EXCLUDED_DIRS.some(d => filePath.includes(path.sep + d + path.sep));
}

function unquote(value) {
  const v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const yaml = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (/^\s*#/.test(line)) continue; // comment
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const raw = kv[2].trim();
    if (raw.startsWith('[') && raw.endsWith(']')) {
      // Flow sequence: [a, b, c] — YAML does not require JSON quoting.
      yaml[kv[1]] = raw.slice(1, -1).split(',').map(s => unquote(s)).filter(s => s !== '');
    } else {
      yaml[kv[1]] = unquote(raw);
    }
  }
  return yaml;
}

function validateFile(filePath, { rootExempt }) {
  const rel = path.relative(KB_ROOT, filePath);
  const stat = fs.statSync(filePath);

  if (stat.size > MAX_FILE_SIZE) {
    errors.push(`${rel}: exceeds 50KB limit (${(stat.size / 1024).toFixed(1)}KB)`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const fm = parseFrontmatter(content);

  if (!fm) {
    if (rootExempt) {
      warnings.push(`${rel}: no frontmatter (repository-level file — allowed)`);
    } else {
      errors.push(`${rel}: missing or malformed YAML frontmatter`);
    }
  } else {
    for (const field of REQUIRED_FRONTMATTER) {
      const v = fm[field];
      if (v === undefined || v === '' || v === null || (Array.isArray(v) && v.length === 0)) {
        errors.push(`${rel}: missing required frontmatter field "${field}"`);
      }
    }

    if (fm.audience !== undefined && !VALID_AUDIENCES.includes(String(fm.audience).toLowerCase())) {
      errors.push(`${rel}: invalid audience "${fm.audience}" — must be human, ai, or both`);
    }

    if (fm.section !== undefined) {
      const section = String(fm.section).toLowerCase();
      if (!VALID_SECTIONS.includes(section)) {
        errors.push(`${rel}: invalid section "${fm.section}" — must be one of ${VALID_SECTIONS.join(', ')}`);
      } else {
        const dir = rel.includes(path.sep) ? rel.split(path.sep)[0] : '';
        if (dir && dir !== section) {
          errors.push(`${rel}: section "${fm.section}" does not match its directory "${dir}"`);
        }
      }
    }

    if (fm.order !== undefined && !/^\d+$/.test(String(fm.order))) {
      errors.push(`${rel}: order must be an integer between 1 and 999`);
    } else if (fm.order !== undefined && (Number(fm.order) < 1 || Number(fm.order) > 999)) {
      errors.push(`${rel}: order must be an integer between 1 and 999`);
    }

    if (typeof fm.title === 'string' && (fm.title.length < 3 || fm.title.length > 200)) {
      errors.push(`${rel}: title must be 3-200 characters (got ${fm.title.length})`);
    }

    if (typeof fm.description === 'string' && (fm.description.length < 10 || fm.description.length > 500)) {
      errors.push(`${rel}: description must be 10-500 characters (got ${fm.description.length})`);
    }

    for (const key of Object.keys(fm)) {
      if (!REQUIRED_FRONTMATTER.includes(key) && !OPTIONAL_FRONTMATTER.includes(key)) {
        warnings.push(`${rel}: unknown frontmatter field "${key}"`);
      }
    }
  }

  // Relative link resolution (external URLs, anchors and mailto are skipped).
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    let link = match[2].trim();
    if (/^(https?:|mailto:|#)/.test(link)) continue;
    link = link.split('#')[0];
    if (link === '') continue;
    const linkedPath = path.resolve(path.dirname(filePath), decodeURI(link));
    if (!fs.existsSync(linkedPath)) {
      errors.push(`${rel}: broken relative link "${match[2]}"`);
    }
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (isExcluded(fullPath)) continue;
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith('.json')) {
      const rel = path.relative(KB_ROOT, fullPath);
      try {
        JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      } catch (e) {
        errors.push(`${rel}: invalid JSON — ${e.message}`);
      }
    } else if (entry.name.endsWith('.md')) {
      const rel = path.relative(KB_ROOT, fullPath);
      validateFile(fullPath, { rootExempt: ROOT_EXEMPT.includes(rel) });
    }
  }
}

// Main
console.log('Validating DMF Knowledge Base...\n');
walkDir(KB_ROOT);

if (errors.length === 0) {
  console.log(`✓ All files pass validation (${warnings.length} warning(s)).`);
  warnings.forEach(w => console.log(`  ⚠ ${w}`));
  process.exit(0);
}

console.log(`✗ ${errors.length} error(s) found:`);
errors.forEach(e => console.log(`  • ${e}`));
if (warnings.length > 0) {
  console.log(`\n⚠ ${warnings.length} warning(s):`);
  warnings.forEach(w => console.log(`  • ${w}`));
}
process.exit(1);
