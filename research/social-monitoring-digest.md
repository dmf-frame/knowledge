# Social Media Monitoring for DeFi - DMF Mentor Research Digest
Date: 2026-06-22
Focus: Detecting scams, impersonation, and misinformation around DMF (dmfUSD on Base: 0x624624fd3821d5f4f8f799369727f08d8219ce58)

## 1. Monitoring Telegram channels/groups for keywords

**API Options:**
- Telegram Bot API: Easiest entry. Bots can join public channels/groups but have strict rate limits (20 messages/sec global). Cannot easily monitor private groups without being added as admin/member. Keyword monitoring requires polling getUpdates or webhooks. Limited to bot's own messages unless using getChatHistory in supergroups (admin only).
- MTProto (Telegram API): Full client API. Libraries like Telethon (Python), Pyrogram allow user accounts or bots to listen to channels. Can join public channels, monitor message history, search by keywords. Requires API ID/hash from my.telegram.org. Rate limits more generous but account can be banned for abuse. For groups, need to be member. Supports listening to new messages via updates.
- Limitations: No official way to monitor arbitrary private groups/chats. Public channels only for passive monitoring. Bots can't read all messages in large groups without admin rights. Privacy laws (GDPR) apply to storing user data.

**Practical Approach for DMF:**
- Use Telethon/Pyrogram with a dedicated monitoring account. Subscribe to known DMF-related public channels (@dmfUSD, community groups). Filter messages containing "dmfUSD", "dmf", contract address, "devmik", etc.
- For keyword alerts: Implement on_message handler, regex or simple string match, queue for further analysis.
- Cost: Free but requires maintaining session (phone verification). Risk of account ban if too aggressive.

## 2. Monitoring X/Twitter for DMF mentions without enterprise API

**Free Tier Limits (as of 2026):**
- Basic free tier: Very restricted. Search API limited to recent 7 days, low rate limits (~100 requests/15min for search). No full-archive access. Posting limited.
- No free access to full Twitter API v2 for historical or high-volume search. Enterprise (paid) required for comprehensive monitoring.
- X Premium (~$8/mo) gives some API access but still limited compared to enterprise.

**Alternatives without Enterprise:**
- Web scraping patterns: Use unofficial libraries or direct requests to twitter.com/search, but highly unreliable, against ToS, and breaks frequently (rate limiting, JS rendering, login walls). Tools like snscrape (deprecated), twscrape, or playwright/selenium for browser automation. High ban risk; use proxies, rotating headers, delays.
- Nitter instances (self-hosted): Deprecated but some forks exist for scraping.
- RSS feeds: Limited, no real-time keyword search.
- Recommended: Use xAI Grok API or other providers that proxy X data (but respect terms). For mentions of "dmfUSD" or "$DMF", "dmfUSD scam", etc., rely on periodic polling of public search with careful rate limiting (e.g., 1 request/minute).
- Pattern: Search queries like `"dmfUSD" OR "0x624624fd3821d5f4f8f799369727f08d8219ce58" OR "@SofiaDMF_bot" filter:safe -filter:replies` with since:YYYY-MM-DD.

**Risks:** Scraping violates X ToS, can lead to IP bans. Better to use official limited API or third-party services.

## 3. Open-source social monitoring frameworks

- **TheHive**: Incident response platform (Cortex + MISP integration). Good for case management, alerts, observables. Can ingest from webhooks or scripts. Not real-time social listener out of the box but extensible via analyzers/responders. Strong for SOC-style workflows.
- **Yeti**: Threat intelligence platform focused on observables (domains, IPs, hashes, social handles). Excellent for storing IOCs, relationships, tagging. Can be fed from monitoring scripts. Good for building knowledge graph of scam campaigns.
- **OpenCTI**: Comprehensive CTI platform. Supports STIX2, connectors for external feeds, case management, dashboards. Has connectors for MISP, TheHive. Can model threat actors, campaigns. Suitable for long-term tracking of DMF impersonators.
- Others: MISP (threat intel sharing), Cortex (analysis), Arkime (network but adaptable).

**Recommendation:** Combine Telethon scraper + OpenCTI/Yeti for storage + TheHive for incident workflow. All open-source, self-hosted.

## 4. Impersonation detection

- **Name similarity:** Levenshtein distance, Jaro-Winkler, or fuzzy matching (rapidfuzz library) on usernames, display names against "dmfUSD", "DevMik", "SofiaDMF", official handles. Threshold e.g. >85% similarity flags potential impersonator.
- **Profile pic analysis:** 
  - Perceptual hashing (pHash, dHash) with libraries like imagehash. Compare against known official avatars.
  - Reverse image search via APIs (but limited) or local feature matching (SIFT/ORB with OpenCV).
  - ML: Simple CNN or use pre-trained models (e.g., via HuggingFace) for face similarity if applicable.
- **Other signals:** Bio text similarity, join date, follower count anomalies, posting patterns, URL shorteners in bio, similar banner images.
- **Implementation:** Store known good profiles in DB. On new mention, compute similarity scores. Flag if high name sim + similar pic.

## 5. Efficient scam pattern scanning (keyword matching vs ML)

- **Keyword matching:** Fast, low resource. Maintain lists: scam keywords ("airdrop", "giveaway", "double your", "verify wallet", contract address variants, "dmfUSD fake", phishing domains). Use Aho-Corasick or simple regex for speed. Good baseline.
- **ML approaches:** 
  - Lightweight: TF-IDF + Logistic Regression or Naive Bayes on text for "scam" classification.
  - Better: Use small transformer (DistilBERT, MobileBERT) fine-tuned on scam datasets (e.g., from Kaggle phishing/spam). Or zero-shot with sentence-transformers.
  - For images: OCR (Tesseract) + text analysis on screenshots of fake sites.
- **Hybrid:** Keyword first (fast filter), then ML on candidates to reduce noise. For real-time, keyword + rules > heavy ML.
- Tradeoff: Keywords miss novel scams; ML catches patterns but needs training data and more CPU.

**For DMF:** Start with keywords (contract address, official names + suspicious verbs), escalate suspicious to ML or human.

## 6. Avoiding false positives

- Context window: Check surrounding messages, thread, user history.
- Whitelists: Official accounts, known good channels, verified users.
- Scoring system: Combine multiple signals (name sim + keywords + pic hash + account age) into risk score. Only flag > threshold.
- Human-in-loop: Initial strict thresholds, tune based on feedback.
- Temporal: New accounts posting about DMF = higher risk.
- Negative signals: Legit educational content, price discussion without solicitation.
- Logging: Track FP rate, allow admin to mark as false positive and auto-suppress similar.

## 7. SQLite schema for flagged mentions log

```sql
CREATE TABLE flagged_mentions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,           -- 'telegram', 'x', 'web'
    source_id TEXT,                   -- channel_id, tweet_id, url
    source_handle TEXT,               -- @username or channel name
    content TEXT NOT NULL,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    risk_score REAL DEFAULT 0.0,      -- 0-1 or 0-100
    flags TEXT,                       -- JSON array: ["name_sim", "scam_kw", "impersonation"]
    status TEXT DEFAULT 'pending',    -- pending, reviewed, false_positive, actioned
    reviewed_by TEXT,
    notes TEXT,
    raw_data TEXT                     -- JSON blob of original payload
);

CREATE INDEX idx_platform_detected ON flagged_mentions(platform, detected_at);
CREATE INDEX idx_status ON flagged_mentions(status);
CREATE INDEX idx_risk ON flagged_mentions(risk_score DESC);
```

Add tables for known_officials, impersonators, keyword_lists if needed.

## 8. Real-time vs batch monitoring

- **Real-time (streaming):** Sub-second to minutes latency. Critical for active scams (e.g., live phishing during airdrop). Requires always-on listeners (Telethon updates, X streaming if available). Higher resource use, more complex.
- **Batch (periodic polling):** 5-60 min intervals. Sufficient for most misinformation. Simpler, cheaper. Use cron or scheduler.
- **Acceptable latency for scam detection:** 
  - High-risk (impersonation + scam keywords): <5 minutes ideal, max 15 min.
  - General mentions: 30-60 min acceptable.
  - Misinformation spread: 1-2 hours ok if not financial loss imminent.
- Hybrid: Real-time for high-priority keywords/channels, batch for broad search.

## 9. Admin approval workflow before any action

- **Core principle:** Never auto-act (no auto DMs, reports, blocks). Always human approval.
- **Workflow:**
  1. Monitor → Flag → Store in SQLite (status=pending).
  2. Notification: Push to admin dashboard / Telegram bot alert / email digest (batched).
  3. Admin reviews in UI or via commands: view content, risk factors, similar past cases.
  4. Actions available: Mark false positive (trains model), Ignore, Report to platform, Add to watchlist, Escalate to TheHive case.
  5. Audit log: All decisions recorded.
- Implementation: Simple web UI (Flask/Streamlit) or even CLI/TG bot for approvals. Queue system (Redis or just DB) for pending items.
- Benefits: Avoids overreach, legal safety, improves accuracy over time.

## 10. Existing DeFi scam monitoring services (subscribe vs build)

**Existing Services:**
- Chainalysis, TRM Labs, Elliptic: Enterprise blockchain analytics + some social monitoring. Expensive (5-6 figures/year).
- Scam detection specific: ScamSniffer, PeckShield, SlowMist (incident response), Twitter bots like @scamfari, community tools.
- Social-focused: Brand24, Mention, Meltwater (general social listening) — not DeFi specific.
- DeFi specific communities: Often custom bots in Discord/Telegram (e.g., many projects run their own "scam alert" channels).
- Free/cheap: Use X lists, Telegram bots like @MissRose_bot for groups, manual monitoring.

**Subscribe vs Build:**
- Subscribe: Faster, maintained by experts, broad coverage. But costly, less customizable for DMF-specific signals (e.g., exact contract mentions), data ownership issues.
- Build: Full control, tailored (DMF contract address, specific impersonators), integrates with your vault/admin tools, lower long-term cost. Requires ongoing maintenance (API changes, model updates).
- Recommendation for DMF: Build lightweight custom solution (Telethon + simple scorer + SQLite + approval bot) first. Scale to OpenCTI if volume grows. Supplement with free community signals. Avoid full enterprise unless raising serious funding.

## Next Steps for DMF Mentor Implementation
- Prototype: Telethon listener for 5 key Telegram channels + basic keyword scanner.
- Store in SQLite with schema above.
- Add fuzzy name check.
- Simple approval via Telegram bot commands.
- Latency target: 5-10 min polling/batch initially.
- Evaluate OpenCTI connector later.

This digest prioritizes practical, low-cost, self-hosted approaches suitable for a DeFi project team.