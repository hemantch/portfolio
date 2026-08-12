# GetBukd — Project State

**Status:** Draft 1 WORKING — AI voice agent answers calls, looks up services, checks calendar, and responds naturally  
**Repo:** github.com/hemantch/getbukd  
**Local path:** ~/dev/getbukd  
**Live URL:** TBD (Vercel)  
**Last updated:** 2026-04-29

---

## What It Is

AI voice receptionist for local businesses. When a customer calls and nobody answers, the AI takes over the live call — has a natural conversation, understands what the customer needs, checks real availability, and books an appointment. Business owner gets notified, customer gets confirmed. No missed revenue.

---

## Current Status — IT WORKS ✅

The core voice → AI → tools → response pipeline is fully functional:
- ✅ Retell connects via WebSocket to our Custom LLM server
- ✅ Groq (llama-3.3-70b-versatile) reasons about customer requests
- ✅ `lookup_services` tool — queries Supabase, returns real business services
- ✅ `check_availability` tool — queries Google Calendar via OAuth2, returns real open slots
- ✅ AI responds naturally in 1-2 sentences (voice-optimized)
- ✅ Tool calls work correctly (single tool per turn, text-only follow-up)
- ✅ Voice sounds natural via Lily (ElevenLabs, English UK)
- ✅ Conversations logged to Supabase

### Still to test
- [ ] `book_appointment` tool — create a real Google Calendar event
- [ ] `escalate_to_human` tool — send notification email via Resend
- [ ] Full end-to-end: customer → book → calendar event appears → owner notified

### Still to do (Draft 1 completion)
- [ ] Add credit card to Retell → provision a real phone number
- [ ] Test via actual phone call (not just browser test)
- [ ] Deploy to Vercel
- [ ] Publish Google OAuth app to production (stops 7-day token expiry)
- [ ] Demo to a real business owner

---

## How It Works

```
Customer calls business
    ↓
Owner doesn't answer (15 sec timeout)
    ↓
Call forwards to Retell AI voice agent
    ↓
Retell handles audio (STT → speech to text, TTS → text to speech)
    ↓
Retell opens WebSocket to our server: ws://host/llm-websocket/:call_id
    ↓
Our backend calls Groq LLM with tools:
    ├── lookup_services → Supabase (what does the business offer?)
    ├── check_availability → Google Calendar API via OAuth2 (what slots are open?)
    ├── book_appointment → Google Calendar API via OAuth2 (create event)
    └── escalate_to_human → Resend (notify owner)
    ↓
LLM response sent back to Retell via WebSocket → spoken to customer
    ↓
Appointment booked → email confirmation to business owner
```

---

## Architecture

Single orchestrator agent with tool-calling (ReAct pattern). Groq receives conversation context, decides what to do, calls the appropriate tool. Key architectural decisions made during build:

- **WebSocket, not HTTP POST** — Retell Custom LLM uses persistent WebSocket per call
- **Custom server (tsx)** — Next.js API routes don't support WebSocket natively, so we use a custom server.ts with express-ws
- **Single tool call per turn** — multi-step chaining in one turn caused Groq to generate malformed XML tool calls. Fixed by splitting into one tool per turn with text-only follow-up. Natural for voice anyway (customer confirms before booking).
- **No tool definitions on follow-up calls** — passing tools to Groq after feeding tool results back caused `tool_use_failed`. Fixed with groqTextOnly for follow-up calls.
- **Agent created via API** — Retell dashboard UI didn't expose Custom LLM option. Created agent programmatically via retell-sdk.

---

## Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 15 + custom server (tsx) | Custom server for WebSocket support |
| Styling | Tailwind CSS v4 | |
| LLM | Groq + llama-3.3-70b-versatile | Free tier, lowest latency |
| Voice AI | Retell AI (Custom LLM mode) | WebSocket, Lily voice (ElevenLabs, en-GB) |
| Calendar | Google Calendar API (OAuth2) | Refresh token, freebusy + event creation |
| Database | Supabase (Postgres) | Businesses, services, conversations, bookings |
| Email | Resend | Owner notifications |
| Hosting | Vercel (pending deploy) | |
| Tunnel (dev) | Ngrok | Expose localhost for Retell webhook |

---

## All Env Vars ✅

```
GROQ_API_KEY=                   # ✅
RETELL_API_KEY=                 # ✅
GOOGLE_CLIENT_ID=               # ✅
GOOGLE_CLIENT_SECRET=           # ✅
GOOGLE_REFRESH_TOKEN=           # ✅ (regenerated 2026-04-29, publish app to avoid 7-day expiry)
GOOGLE_CALENDAR_ID=             # ✅
SUPABASE_URL=                   # ✅ (was typo'd initially — fixed)
SUPABASE_ANON_KEY=              # ✅
RESEND_API_KEY=                 # ✅
BUSINESS_ID=                    # ✅
```

---

## Setup Issues & Solutions Log

### Supabase URL typo
- **Issue:** Hostname characters in wrong order, all Supabase calls failed silently
- **Solution:** Corrected URL to match the JWT ref field

### Google Cloud org policy blocks service account keys
- **Issue:** `iam.disableServiceAccountKeyCreation` enforced
- **Solution:** Used OAuth2 with refresh token instead

### Google OAuth "Access blocked: not completed verification"
- **Issue:** App in testing mode
- **Solution:** Added own email as test user (Auth → Audience → Test users)

### Google OAuth `invalid_grant`
- **Issue:** Refresh token rejected by Google
- **Cause:** Testing mode token expiry + re-auth without revoking first
- **Solution:** Revoke at myaccount.google.com/permissions, re-authenticate, save new token
- **Permanent fix:** Publish OAuth app to production status

### Retell Custom LLM uses WebSocket not HTTP POST
- **Issue:** Initial webhook was REST endpoint
- **Solution:** Claude Code caught this, rewrote as WebSocket server

### Retell dashboard doesn't show Custom LLM option
- **Issue:** UI only shows built-in models (GPT, Claude, Gemini)
- **Solution:** Created agent via Retell API using retell-sdk

### Retell phone number requires credit card
- **Issue:** 402 error when provisioning number
- **Solution:** Pending — need to add card to Retell. Browser test works without a number.

### Groq `tool_use_failed` — malformed tool calls
- **Issue:** Groq generating `<function=...>` XML instead of JSON on follow-up calls
- **Cause:** Passing tool definitions on the second Groq call (after tool results)
- **Solution:** Use groqTextOnly (no tools) for follow-up calls. Single tool per turn.

### Conversations table UUID mismatch
- **Issue:** `id` column was UUID type but Retell call IDs are strings
- **Solution:** Altered column type from UUID to TEXT

### Node.js v25 ERR_REQUIRE_CYCLE_MODULE
- **Issue:** Circular dependency error with ES modules
- **Solution:** Claude Code fixed the import cycle

### Env vars not loading with custom server
- **Issue:** `tsx server.ts` didn't load `.env.local` automatically
- **Solution:** Used `--env-file=.env.local` Node flag

---

## Roadmap

- **Draft 1** → Working prototype ✅ IN PROGRESS (see [[Projects/GetBukd/Draft-1-Plan]])
- **Draft 2** → Enhanced features + SaaS groundwork (see [[Projects/GetBukd/Draft-2-Plan]])
- **Draft 3** → Full SaaS (auth, billing, multi-tenant, onboarding)

---

## Related Notes
- [[Projects/GetBukd/Draft-1-Plan]]
- [[Projects/GetBukd/Draft-2-Plan]]
- [[Projects/Local-Business-SEO]] — same target customer, potential bundle
