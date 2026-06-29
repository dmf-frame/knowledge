# DMF WebMCP Tool Catalog

**Status:** Live in production since 2026-06-25
**Sites:** [dmfam.org](https://dmfam.org) (8 tools), [app.dmfam.org](https://app.dmfam.org) (21 tools)
**Total:** 29 tools across 4 safety tiers

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

### dmfam.org — Site Tools (8)

| Tool | Tier | Description | Wraps |
|------|------|-------------|-------|
| site_read_page_state | T0 | Returns current page URL, title, and which DMF section | window.location + page metadata |
| site_get_transparency | T0 | Live dmfUSD reserves, circulation, and backing ratio | GET /api/tokens |
| site_get_protocol_facts | T0 | Full protocol fact sheet (same as /ai snippet) | AI_SNIPPET constant |
| site_search_faq | T0 | Search FAQ content by keyword | data/faqData.ts |
| site_list_docs | T0 | Categorized documentation index from llms.txt | public/llms.txt |
| site_ask_support | T0 | Ask Susan (DMF support assistant) a protocol question | POST /api/chat (DeepSeek V4 Flash) |
| site_navigate | T1 | Navigate to any DMF page by destination name | next/router + window.location |
| site_open_app | T1 | Open DMF App (app.dmfam.org) in new or current tab | window.open() |

### app.dmfam.org — App Tools (21)

#### T0 — Read tools (no confirmation needed)

| Tool | Description | Wraps |
|------|-------------|-------|
| app_read_page_state | Returns app mode, active tab, wallet connection status, and chain | React state + wagmi useAccount |
| app_get_backing | Current on-chain backing per dmfUSD token on Base | getBackingPerToken() via viem |
| app_get_balances | Connected wallet USDC and dmfUSD balances on Base | viem balanceOf calls |
| app_preview_buy | Estimates dmfUSD received for USDC deposit after fees | previewDmfBuy() math |
| app_preview_sell | Estimates USDC received for dmfUSD refund after fees | previewDmfSell() math |
| app_preview_swap | Quote for multi-chain swap via Relay API | fetch https://api.relay.link/quote/v2 |
| app_list_chains | Lists supported multi-chain chains and tokens from Relay | fetch https://api.relay.link/chains |

#### T1 — UI preparation (form fill, no confirm)

| Tool | Description | Wraps |
|------|-------------|-------|
| app_set_mode | Switches between DMF buy/sell and multi-chain swap modes | setMode() in page.tsx |
| app_set_dmf_tab | Switches between buy and sell tab within DMF mode | setDmfTab() state |
| app_set_buy_amount | Sets the USDC buy amount field and returns preview | setAmount() state |
| app_set_sell_amount | Sets the dmfUSD sell amount field and returns preview | setAmount() state |
| app_configure_swap | Sets multi-chain swap parameters (from/to chain, token, amount) | Module-level config ref |

#### T2 — Wallet interaction

| Tool | Description | Wraps |
|------|-------------|-------|
| app_connect_wallet | Opens the wallet connection modal (RainbowKit) | openConnectModal() |
| app_switch_to_base | Prompts wallet to switch to Base mainnet (chain 8453) | switchChainAsync() |

#### T3 — Financial execution (confirmation + wallet signature required)

| Tool | Description | Wraps |
|------|-------------|-------|
| app_request_confirm | Shows confirmation dialog for pending buy/sell/swap. Returns one-time confirmToken valid 60s | ConfirmationModal.tsx |
| app_execute_buy | Initiates USDC → dmfUSD purchase. Checks allowance, opens wallet for signature | onBuy() in BuyDmfUsd.tsx |
| app_execute_sell | Initiates dmfUSD → USDC refund. Checks balance + reserves, opens wallet | onRefund() in SellDmfUsd.tsx |
| app_execute_swap | Validates confirmToken, opens Relay SwapWidget with pre-filled params | SwapExecutionModal.tsx |

---

## Safety Tier Model

| Tier | Label | readOnlyHint | User Confirm | Examples |
|------|-------|-------------|--------------|---------|
| T0 | Read | `true` | None | transparency, previews, docs |
| T1 | UI prep | `false` | None | set amount, switch tab |
| T2 | Wallet prompt | `false` | Implicit (wallet UI) | connect wallet |
| T3 | Financial execute | `false` | **Required** before tool runs | buy, sell, swap |

**T3 rule:** Execute tools must call in-app confirmation showing amounts, fees, chain, and contract address before initiating any transaction flow. Wallet signature is always required separately — never auto-signed.

## Example Agent Workflows

### "What is dmfUSD backing right now?"

```
Agent → site_get_transparency({ refresh: false })
      → returns backing %, reserves, circulation
```

### "Help me buy 50 USDC of dmfUSD"

```
Agent → app_read_page_state()
      → app_connect_wallet()                     # if not connected
      → app_switch_to_base()                     # if wrong chain
      → app_set_mode({ mode: "dmf" })
      → app_set_dmf_tab({ tab: "buy" })
      → app_preview_buy({ usdcAmount: "50" })
      → app_set_buy_amount({ usdcAmount: "50" })
      → app_request_confirm({ action: "buy", summary: {...} })
      → [user clicks Confirm in modal]
      → app_execute_buy({ usdcAmount: "50", confirmToken: "..." })
      → [user signs in wallet]
```

### "Why is my swap failing?"

```
Agent → site_search_faq({ query: "swap fail" })
      → site_navigate({ destination: "swap-troubleshooting" })
      → site_open_app({ target: "app", newTab: true })
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

`NEXT_PUBLIC_WEBMCP_ENABLED=true` must be set at build time (Next.js inlines `NEXT_PUBLIC_*` vars into the JS bundle).

### Source Files

- **DMF-org:** `app/lib/webmcp/DmfWebMcpProvider.tsx` + `site-tools.ts`
- **DMF-app:** `src/lib/webmcp/DmfWebMcpProvider.tsx` + `app-tools.ts` + `app-execute-tools.ts` + `app-swap-tools.ts` + `ConfirmationModal.tsx`
- **Schemas:** `study/dmf-webmcp-schemas/` (29 JSON schemas + generated TypeScript types)

## Related

- [/support](https://dmfam.org/support) — Susan, DMF web support assistant (powered by llm)
- [llms.txt](https://dmfam.org/llms.txt) — Machine-readable index
- [llms-full.txt](https://dmfam.org/llms-full.txt) — Full knowledge base
