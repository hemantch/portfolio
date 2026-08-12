# Local Business SEO Tool — Project State

**Status:** Draft 1 — Building  
**Repo:** TBD (github.com/hemantch/localseo)  
**Local path:** ~/dev/local-seo-tool  
**Live URL:** TBD (Vercel)  
**Last updated:** 2026-04-20

---

## Current Phase: Draft 1 — Free Audit Tool (Stateless)

### What it does
User enters business name + location → Google Places API returns profile → deterministic audit engine scores it → Groq LLM generates plain English report → results displayed in browser.

### What it does NOT do (yet)
- No auth / login
- No database / persistence
- No email capture
- No payments / subscriptions
- No weekly monitoring
- No review response drafting

### Design decisions
- **Stateless** — nothing persisted, results generated on the fly
- **No database** — revisit when adding user accounts / monitoring
- **No auth** — revisit when monetising
- **Free for everyone** — validate demand before building SaaS features

---

## Tech Stack (Draft 1)

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | TypeScript, src/ directory |
| Styling | Tailwind CSS v4 | Theme in globals.css @theme block |
| LLM | Groq + llama-3.3-70b-versatile | Plain English audit reports |
| Business data | Google Places API (New) | Place search + place details |
| Hosting | Vercel | Free tier, familiar |
| Domain | Porkbun | Register when ready |

### API Keys needed
- `GROQ_API_KEY` — from console.groq.com
- `GOOGLE_PLACES_API_KEY` — from Google Cloud Console (Places API enabled)

---

## Architecture

```
[Browser] → AuditForm (name + location)
    ↓ POST /api/audit
[API Route]
    ↓ 1. Google Places Text Search → find place_id
    ↓ 2. Google Places Details → full profile + reviews
    ↓ 3. audit-engine.ts → deterministic scoring (0-100)
    ↓ 4. Groq LLM → plain English report from scored data
    ↓ 5. Return JSON response
[Browser] → AuditReport renders results
```

### Audit scoring categories
1. **Google Profile Completeness** (25 pts) — name, address, phone, hours, categories, description, photos
2. **Reviews** (25 pts) — count, average rating, recency, response rate
3. **Web Presence** (25 pts) — website exists, SSL, mobile-friendly indicators
4. **Photos & Visual Content** (25 pts) — photo count vs competitors

### Scoring is deterministic (no LLM)
The health score is calculated by `audit-engine.ts` using hard rules. The LLM's job is ONLY to narrate the findings in plain English and generate actionable recommendations. This keeps scoring consistent and reproducible.

---

## Project Structure

```
local-seo-tool/
├── src/
│   ├── app/
│   │   ├── page.tsx                # Landing page + audit form
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Tailwind v4 theme
│   │   └── api/
│   │       └── audit/
│   │           └── route.ts        # POST: full audit pipeline
│   ├── lib/
│   │   ├── google-places.ts        # Google Places API client
│   │   ├── groq.ts                 # Groq LLM client
│   │   └── audit-engine.ts         # Deterministic scoring logic
│   ├── components/
│   │   ├── AuditForm.tsx           # Name + location input
│   │   ├── HealthScore.tsx         # Circular score visualisation
│   │   ├── GapCard.tsx             # Individual gap/action card
│   │   ├── AuditReport.tsx         # Full results container
│   │   └── Hero.tsx                # Landing page hero
│   └── types/
│       └── audit.ts                # TypeScript interfaces
├── .env.example
├── CLAUDE.md
├── package.json
└── next.config.ts
```

---

## Roadmap

### Draft 1 (current) — Free Stateless Audit
- [ ] Project scaffold (Next.js 15 + Tailwind v4 + TypeScript)
- [ ] Google Places API integration (search + details)
- [ ] Deterministic audit scoring engine
- [ ] Groq LLM report generation
- [ ] Landing page + audit form UI
- [ ] Results page UI (health score + gap cards)
- [ ] Deploy to Vercel
- [ ] Test with real Glasgow businesses

### Draft 1.5 — Polish & Improvements (before adding auth/DB)

**Quick wins (low effort, high impact):**
- [ ] PDF export — let users download their audit report as a PDF. One button, huge value for business owners who want to save/print/share.
- [ ] Shareable link — encode audit result into a URL (base64 query params or hash). Stateless, no DB needed, but lets users share their report.
- [ ] Competitor comparison — optional second field for a competitor business name. Run the same audit, show side-by-side. Makes the tool sticky.
- [ ] Loading experience — step-by-step progress messages while audit runs ("Finding your business on Google...", "Analysing your reviews...", "Generating your report..."). Makes the wait feel intentional.

**Medium effort:**
- [ ] Category deep dives — make each category card expandable. Click on "Reviews & Reputation" to see individual reviews, response status, etc.
- [ ] Action priority list — "Start Here" section at top ranking top 3 actions by impact. Business owners need to know what to do first.
- [ ] Mobile optimisation — ensure full responsiveness. Business owners will share the link and people open on phones.

**Nice to have:**
- [ ] Rate limiting — basic in-memory counter per IP on the API route to prevent abuse.
- [ ] Error recovery / disambiguation — if Google Places returns multiple results, show "Did you mean...?" instead of picking the first one.
- [ ] Social proof — counter on landing page showing how many audits have been run.

### Draft 2 — Persistence + Email
- [ ] Supabase (Postgres) for storing audit results
- [ ] Email capture + Resend for sending reports
- [ ] Shareable audit report URLs

### Draft 3 — Auth + Payments
- [ ] Clerk auth
- [ ] Stripe subscriptions
- [ ] Dashboard with history
- [ ] Weekly monitoring (BullMQ + cron)

---

## Related Notes
- [[Ideas/Local-Business-SEO-Tool]]
- [[Ideas/Problem-Statement-Local-SEO]]
- [[Ideas/Marketing-Plan-Local-SEO]]
