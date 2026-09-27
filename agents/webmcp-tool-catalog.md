---
title: DMF WebMCP Tool Catalog
description: The WebMCP tools exposed on dmfam.org (7 registered; site_ask_support parked) — names, safety tiers, and what each one wraps.
audience: ai
section: agents
order: 9
---

# DMF WebMCP Tool Catalog

**Status:** Live in production since 2026-06-25
**Site:** [dmfam.org](https://dmfam.org) (7 tools registered)

**Total:** 7 tools across 2 safety tiers (T0 read, T1 page state). No tool can execute a transaction or sign for the user.

**Parked:** `site_ask_support` (Susan) is still defined in the provider but is **not registered** while the support service is offline — see "Parked tools" below. Agents therefore never see a tool that cannot answer.


## Browser Requirements

- Chrome 151+ (Canary/Dev channel)
- Enable `chrome://flags/#enable-webmcp-testing`
- API surface: `document.modelContext.registerTool()`

## Quick Start

```javascript
// Check if WebMCP is available
if (typeof document !== 'undefined' && document.modelContext?.registerTool) {
  // List available tools
  const tools = await document.modelContext.listTools();
  console.log('Available tools:', tools);

  // Call a tool
  const result = await document.modelContext.callTool('site_read_page_state', {});
  console.log('Page state:', result);
}
```

---

## Tool Catalog

### dmfam.org — Site Tools (7 registered)

| Tool | Tier | Description | Wraps |
|------|------|-------------|-------|
| site_read_page_state | T0 | Returns current page URL, title, and which DMF section | window.location + page metadata |
| site_get_transparency | T0 | Live dmfUSD reserves, circulation, and backing ratio | GET /api/tokens |
| site_get_protocol_facts | T0 | Full protocol fact sheet (same snippet as /support) | `AI_SNIPPET` constant in `app/lib/webmcp/site-tools.ts`, kept in sync with `public/llms.txt` |
| site_search_faq | T0 | Search FAQ content by keyword | data/faqData.ts |
| site_list_docs | T0 | Categorized documentation index (derived from llms.txt) | hardcoded index in `app/lib/webmcp/site-tools.ts` |
| site_ask_support | — | **PARKED — not registered.** Ask Susan (DMF support assistant) a protocol question | POST /api/chat (`deepseek-chat`); re-enable by removing the name from `PARKED_TOOLS` in `DmfWebMcpProvider.tsx` (the handler stays in `site-tools.ts`) |
| site_navigate | T1 | Navigate to any DMF page by destination name | `window.location.href` via a destination map (home, faq, transparency, support, swap-bridge) |
| site_open_app | T1 | Open the external Swap & Bridge service (bridge.blockchainbridge.ai) in new or current tab | window.open() |

## Buy / Sell and Swap / Bridge — not WebMCP tools

Buying and selling dmfUSD is user-driven in the on-site buy/sell card, where the user's wallet signs. Swapping and bridging runs on the external BlockchainBridge service (https://bridge.blockchainbridge.ai/), which opens on its own site and exposes no DMF tools. There are therefore no execute tools, no confirm tokens, and no wallet-management tools in the DMF WebMCP surface.

## Parked tools

A parked tool keeps its definition and handler but is skipped at registration:

```typescript
const PARKED_TOOLS = new Set(['site_ask_support']);
// registerAll(): if (PARKED_TOOLS.has(tool.name)) continue;
```

Parking is a one-line change on purpose: the surface shrinks without deleting code, and re-enabling is the
reverse. Current parked set: `site_ask_support` (support service offline).

## Safety Tier Model

| Tier | Label | readOnlyHint | User Confirm | Examples |
|------|-------|-------------|--------------|---------|
| T0 | Read | `true` | None | transparency, protocol facts, FAQ search, docs list |
| T1 | Page state | `false` | None | navigate, open the external swap & bridge service |

**Rule:** no tool in the DMF surface moves funds or signs. Buying and selling goes through the user-driven buy/sell card, where the wallet signature is always required.

## Example Agent Workflows

### "What is dmfUSD backing right now?"

```
Agent → site_get_transparency({ refresh: false })
      → returns backing %, reserves, circulation
```

### "Help me buy 50 USDC of dmfUSD"

```
Agent → site_get_protocol_facts()                # facts + contract address
      → site_read_page_state()                   # where the buy/sell card is
      → site_navigate({ destination: "home" })
      → [agent tells the user what to do]
      → [user connects wallet, enters 50 USDC, confirms]
      → [user signs in wallet — no DMF tool can do this]
```

### "Why is my swap failing?"

```
Agent → site_search_faq({ query: "swap fail" })
      → site_navigate({ destination: "swap-troubleshooting" })
      → site_open_app({ newTab: true })          # opens BlockchainBridge
```

---

## Implementation Notes

### API Surface

WebMCP API moved from `navigator.modelContext` to `document.modelContext` in Chrome 151+.
Always check for `.registerTool` method existence, not just property existence:

```typescript
function getMc() {
  if (typeof document !== 'undefined' && document.modelContext?.registerTool)
    return document.modelContext;
  if (typeof navigator !== 'undefined' && navigator.modelContext?.registerTool)
    return navigator.modelContext;
  return null;
}
```

**Pitfall:** `'modelContext' in navigator` returns `true` even when the property is a deprecated stub with no methods.

### Feature Flag

`NEXT_PUBLIC_WEBMCP_ENABLED=true` must be set at build time — Next.js inlines `NEXT_PUBLIC_*` into the JS bundle, and the flag is **not** in the app repo (`.env.local` is gitignored). It is recorded in the tracked `.env.example` and lives in the deploy host's `~/dmf-v2/.env.local`. A build without it ships zero tools and logs nothing.

Verify after any deploy: fetch `/_next/static/chunks/app/layout-*.js` from the live site and grep for
`site_read_page_state` (must be present) and `NEXT_PUBLIC_WEBMCP_ENABLED` (must be absent — absent means
the flag was folded to `true` at build; still present means it is being read at runtime and the tools are off).

### Source Files

- **DMF web:** `app/lib/webmcp/DmfWebMcpProvider.tsx` + `site-tools.ts`
- **Schemas:** `study/dmf-webmcp-schemas/` (8 JSON schemas + generated TypeScript types)

## Related

- [/support](https://dmfam.org/support) — Susan, DMF web support assistant (powered by llm)
- [llms.txt](https://dmfam.org/llms.txt) — Machine-readable index
- [llms-full.txt](https://dmfam.org/llms-full.txt) — Full knowledge base
