---
title: WebMCP E2E Test Agent Architecture
description: Architecture for a Playwright-based agent that end-to-end tests the 7 registered DMF WebMCP tools on dmfam.org (site_ask_support parked and excluded from live-tool assertions), including the read-only safety boundary
audience: ai
section: agents
order: 6
tags: [webmcp, testing, e2e, playwright, safety]
version: 2.0.1
updated: 2026-09-29
---

# WebMCP E2E Test Agent — Architecture

## 1. Overview

dmfam.org registers 7 WebMCP tools — 5 read-only T0 tools and 2 T1 page-state tools (`site_navigate`, `site_open_app`). The 8th definition, `site_ask_support`, is parked while the support service is offline. None of them can move funds. Unit tests cover handler logic; they do not verify that tools actually register, respond correctly against live chain state, or stay free of execution capability. This agent closes that gap.

**What it tests:**

| Layer | What | Why |
|-------|------|-----|
| Registration | Every tool listed in the catalog actually appears in `modelContext.listTools()` | Silent registration failure is invisible |
| Schema | Every tool response matches its declared output schema | Mismatches break agents that trust the schema |
| Functional T0/T1 | Read and navigation tools return correct data against live on-chain state | Mock data drifts from real reserves |
| Safety boundary | No registered tool can move funds, sign, or send a transaction | Buying and selling must stay user-driven |
| Error states | Bad arguments are rejected, never crash | Agents retry aggressively |

**Non-goals:** unit-testing handler functions, load testing, visual regression, wallet signature simulation, and coverage of the external BlockchainBridge swap and bridge service — that runs on its own site (https://bridge.blockchainbridge.ai/) and is outside DMF's test surface.

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Hermes (or CI shell)                                       │
│  └─ npm/pnpm test:e2e:webmcp                               │
│       └─ Playwright Test Runner                             │
│            ├─ webmcp.config.ts ── Chrome Canary config      │
│            └─ specs/                                        │
│                 ├─ 01-registration.spec.ts                  │
│                 ├─ 02-schema-validation.spec.ts             │
│                 ├─ 03-tier0-reads.spec.ts                   │
│                 ├─ 04-tier1-navigation.spec.ts              │
│                 ├─ 05-safety-boundary.spec.ts               │
│                 ├─ 06-error-states.spec.ts                  │
│                 └─ helpers/                                 │
│                      ├─ browser.ts — launch Chrome Canary   │
│                      ├─ webmcp.ts — modelContext helpers    │
│                      ├─ fixtures.ts — test data             │
│                      └─ assertions.ts — response validators │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 Key Components

**browser.ts** — Launches Chrome Canary with required flags:
- `--enable-webmcp-testing`
- `--enable-devtools-webmcp-support`
- Headless mode (Chrome Canary 151+ supports headless WebMCP)
- Single persistent context (wallet session persists across tests)

**webmcp.ts** — Thin wrappers over `page.evaluate()`:
```typescript
// List all registered tools
async function listTools(page): Promise<ToolDescriptor[]>

// Call a tool and return parsed response
async function callTool(page, name: string, args: object): Promise<ToolResponse>

// Check if a specific tool is registered
async function hasTool(page, name: string): Promise<boolean>
```

**assertions.ts** — Schema + contract validators:
- `assertToolResponseMatchesSchema(response, schema)` — structural match
- `assertNoExecutionTools(tools)` — the registered set is exactly the 7 known read/navigation tools (`site_ask_support` excluded while parked)
- `assertResponseHasFields(response, fields)` — field presence

### 2.2 Page Lifecycle Per Test File

```
beforeAll ─► Navigate to dmfam.org → wait for hydration → verify WebMCP available
  │
  test 1 ──► callTool(name, args) → assert response
  test 2 ──► callTool(name, args) → assert response
  ...
  test N ──► callTool(name, args) → assert response
  │
afterAll ─► Close page
```

One site, one suite. There is no second DMF site to test against — swap and bridge open on BlockchainBridge, which DMF does not instrument.

## 3. Test Matrix

### 3.1 Registration — dmfam.org

| Site | Expected Count | Test |
|------|---------------|------|
| dmfam.org | 7 | `hasTool(page, "site_read_page_state")` — all 7 by name |
| dmfam.org | — | No unexpected extra tools registered |
| dmfam.org | — | Every tool name is in the `site_*` namespace |
| dmfam.org | — | Each tool has non-empty `name`, `description`, `inputSchema` |

### 3.2 Schema Validation — All 7 Registered Tools (skip parked tools)

For each tool, call with minimal valid args and verify:
- Response has `content` array with at least one `{ type: "text" }` entry
- Text content is valid JSON
- JSON has `success: true` at top level (or expected error shape for intentional failure cases)
- All declared output fields present (where schema declares them)
- No unexpected fields

### 3.3 T0 Read Tools — Functional Correctness

| Tool | What it should return |
|------|----------------------|
| `site_get_transparency` | backing % > 0, reserves > 0, circulation > 0 |
| `site_get_protocol_facts` | Non-empty fact sheet; contract address on Base mainnet (8453) |
| `site_search_faq` | ≥ 1 result for a known term ("fee"); empty-but-valid for gibberish |
| `site_list_docs` | Lists public doc paths; each path resolves 200 |
| `site_read_page_state` | URL, title and section match the rendered page |
| `site_ask_support` | **Parked — skip.** Not registered while the support service is offline; re-add this row when it returns |

### 3.4 T1 Navigation Tools — State Mutation

| Tool | Assertion |
|------|-----------|
| `site_navigate({ destination: "transparency" })` | URL becomes `/transparency`; page state reflects it |
| `site_navigate({ destination: "unknown-destination" })` | Rejected, no navigation |
| `site_open_app({ newTab: false })` | Leaves for `https://bridge.blockchainbridge.ai/` |
| `site_open_app({ targetUrl: "https://evil.example" })` | Rejected — only allowlisted origins open |

### 3.5 Safety Boundary — Critical

| Scenario | Expected |
|----------|----------|
| Registered tool list | Contains no tool that can move funds, sign, or send a transaction |
| Any tool called with a transaction-shaped payload | Ignored — no wallet prompt, no RPC write |
| On-chain effect | Site tools issue no state-changing RPC calls; buying and selling happen only in the user-driven buy/sell card, where the user signs |

**Rule:** if a future tool registers that can execute a transaction, that is a security regression, not a test failure to triage — the DMF site surface is read-and-navigate only.

### 3.6 Full Flow Tests — Multi-Step Sequences

**"What is the backing right now?"**
```
site_get_transparency({ refresh: false })   ← backing %, reserves, circulation
  → site_read_page_state()                  ← confirm the section reported
```

**"Why is my swap failing?"**
```
site_search_faq({ query: "swap fail" })
  → site_navigate({ destination: "swap-troubleshooting" })
    → site_open_app({ newTab: true })       ← leaves for BlockchainBridge
```

This validates that multi-tool sequences resolve without errors and that the off-site handoff works.

### 3.7 Error States — Resilience

| Input | Expected |
|-------|----------|
| `site_search_faq({})` — missing args | Rejection, not crash |
| `site_search_faq({ query: "" })` | Empty result set, valid envelope |
| `site_navigate({ destination: "nope" })` | Rejection, current URL unchanged |
| `site_ask_support({ question: "" })` | **Parked — skip** (see 3.2) |
| `site_get_transparency` while the RPC is unreachable | Graceful error envelope, no crash |

## 4. Infrastructure Requirements

### 4.1 Chrome Canary

- Chromium build v151+ with WebMCP support compiled in
- Installed at a known path (e.g. `/usr/bin/google-chrome-canary` or `~/.cache/ms-playwright/chromium-canary`)
- Playwright channel config: `channel: 'chrome-canary'`

### 4.2 Playwright Version

- Playwright 1.52+ (recent enough to track Chrome Canary flags)
- Direct channel launch, not `playwright install chromium` (stable channel lacks WebMCP)

### 4.3 Environment Variables

| Var | Purpose |
|-----|---------|
| `DMF_TEST_SITE_URL` | dmfam.org URL (default: https://dmfam.org) |
| `DMF_TEST_CHROME_PATH` | Override Chrome Canary binary path |
| `DMF_TEST_HEADLESS` | `true`/`false` for visual debugging |

### 4.4 Project Location

Tests live in a standalone directory separate from the DMF web repo (no coupling to build):

```
~/dmf-webmcp-tests/
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── specs/
│   ├── site-t0-reads.spec.ts     # 5 read tools (site_ask_support parked)
│   ├── site-t1-nav.spec.ts       # 2 navigation tools
│   └── site-safety.spec.ts       # read-only boundary enforcement
└── helpers/
    ├── browser.ts
    ├── webmcp.ts
    ├── fixtures.ts
    └── assertions.ts
```

## 5. Running the Tests

```bash
# Full suite
cd ~/dmf-webmcp-tests
npm test

# Single spec
npx playwright test specs/site-safety.spec.ts

# With visible browser (debug mode)
DMF_TEST_HEADLESS=false npx playwright test --headed
```

Expected runtime: ~30-60s for registration + schemas, ~1-2 min for the full suite.

## 6. Failure Modes & Diagnostics

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `modelContext` is null/undefined | Chrome Canary flags not enabled | Verify flag string, launch args |
| `registerTool` is not a function | Chrome 150- using navigator.modelContext stub | Upgrade to 151+, check document first |
| Tools list shows 0, no errors | Provider not mounted (feature flag off) | Check NEXT_PUBLIC_WEBMCP_ENABLED in bundle |
| A tool can move funds | **BROKEN** — safety regression | Flag immediately, block the release |
| `site_ask_support` times out | **Parked tool** — only relevant once it is re-registered | Retry after 5s, fail gracefully if persistent |
| Site loads but tools are from old build | CDN cache serving stale JS | Hard reload, or check .next build hash |

## 7. Integration with Existing Infrastructure

- Results format: Playwright JUnit XML (parsable by CI)
- Alerts: on `safety_boundary_violated`, notify immediately (this is a security issue, not a regression)
- Relation to Susan/Sofia: the test agent is independent — Susan exercises WebMCP every time she answers a support query through `site_ask_support`, but that is a single tool — and with `site_ask_support` parked, that path is paused too. This agent tests the full registered surface.

## 8. Future Extensions

- Post-deploy regression sweep against the freshly deployed build hash
- Performance benchmarks (tool response latency per tier)
- Cronjob for a daily sweep (cronjob + `--reporter=json`)
