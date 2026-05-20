#!/usr/bin/env node

/**
 * DMF Knowledge Base Validation Script
 * Checks: required frontmatter fields, relative link resolution, broken cross-references
 * Usage: node validate-knowledge.mjs [--fix]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KB_ROOT = path.resolve(__dirname, '..');

const REQUIRED_FRONTMATTER = ['title', 'description', 'audience', 'section', 'order'];
const VALID_AUDIENCES = ['human', 'ai', 'both'];
const VALID_SECTIONS = ['agents', 'contracts', 'docs', 'integrations', 'meta', 'scripts', 'tests', 'tools'];
const MAX_FILE_SIZE = 50 * 1024; // 50KB
const EXCLUDED_DIRS = ['node_modules', '.git', '.env'];

const errors = [];
const warnings = [];

function isExcluded(filePath) {
  return EXCLUDED_DIRS.some(d => filePath.includes(path.sep + d + path.sep));
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const yaml = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) {
      let value = kv[2].trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        value = JSON.parse(value.replace(/'/g, '"'));
      }
      yaml[kv[1]] = value;
    }
  }
  return yaml;
}

function validateFile(filePath) {
  const stat = fs.statSync(filePath);
  
  // Check file size
  if (stat.size > MAX_FILE_SIZE) {
    errors.push(`${filePath}: Exceeds 50KB limit (${(stat.size / 1024).toFixed(1)}KB)`);
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const fm = parseFrontmatter(content);
  
  if (!fm) {
    errors.push(`${filePath}: Missing or malformed YAML frontmatter`);
    return;
  }
  
  // Check required fields
  for (const field of REQUIRED_FRONTMATTER) {
    if (!(field in fm) || fm[field] === '' || fm[field] === null || fm[field] === undefined) {
      errors.push(`${filePath}: Missing required frontmatter field "${field}"`);
    }
  }
  
  // Validate field values
  if (fm.audience && !VALID_AUDIENCES.includes(fm.audience)) {
    errors.push(`${filePath}: Invalid audience "${fm.audience}" — must be human, ai, or both`);
  }
  
  if (fm.section && !VALID_SECTIONS.includes(fm.section)) {
    errors.push(`${filePath}: Invalid section "${fm.section}"`);
  }
  
  if (fm.order !== undefined && (typeof fm.order !== 'number' || fm.order < 1 || fm.order > 999)) {
    errors.push(`${filePath}: order must be an integer between 1 and 999`);
  }
  
  if (fm.title && (fm.title.length < 3 || fm.title.length > 200)) {
    errors.push(`${filePath}: title must be 3-200 characters (got ${fm.title.length})`);
  }
  
  if (fm.description && (fm.description.length < 10 || fm.description.length > 500)) {
    errors.push(`${filePath}: description must be 10-500 characters (got ${fm.description.length})`);
  }
  
  // Check relative links
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const link = match[2];
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('#')) {
      continue; // external or anchor link
    }
    const linkedPath = path.resolve(path.dirname(filePath), link);
    if (!fs.existsSync(linkedPath)) {
      errors.push(`${filePath}: Broken relative link "${link}" -> ${linkedPath}`);
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
    } else if (entry.name.endsWith('.md')) {
      validateFile(fullPath);
    }
  }
}

// Main
console.log('Validating DMF Knowledge Base...\n');
walkDir(KB_ROOT);

if (errors.length === 0 && warnings.length === 0) {
  console.log('✓ All files pass validation.');
  process.exit(0);
}

if (errors.length > 0) {
  console.log(`\n✗ ${errors.length} error(s) found:`);
  errors.forEach(e => console.log(`  • ${e}`));
}

if (warnings.length > 0) {
  console.log(`\n⚠ ${warnings.length} warning(s) found:`);
  warnings.forEach(w => console.log(`  • ${w}`));
}

if (errors.length > 0) {
  process.exit(1);
}
