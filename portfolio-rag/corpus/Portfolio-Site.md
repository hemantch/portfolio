# Portfolio Site

## What It Is
Personal portfolio site at hemanthchappa.com showcasing SRE experience, skills, certifications and projects.

## Stack
- **Framework:** Next.js 16, TypeScript
- **Styling:** Tailwind CSS + @fontsource/syne + @fontsource/inter
- **Animation:** Motion (imports from `motion/react`)
- **Scroll triggers:** react-intersection-observer
- **Icons:** @tabler/icons-react
- **Deployment:** GitHub Pages (static export via GitHub Actions)
- **Domain:** Porkbun DNS → hemanthchappa.com
- **Repo:** github.com/hemantch/portfolio
- **Local path:** ~/dev/hemanthchappa
- **Context file:** AGENTS.md in repo root (keep updated for Claude Code sessions)

## Design System
- Background: `#0A0A0F`
- Primary accent: `#00D4FF` (electric cyan)
- Secondary: `#F5A623` (amber)
- Muted text: `#94A3B8`
- Fonts: Syne (headings), Inter (body)
- Vibe: Bold, creative, dark, techy — "infrastructure at scale"

## Sections (current state)
- **Navbar** — transparent, blur on scroll, cyan Hire Me button
- **Hero** — canvas particle network (cyan dots), typewriter cycling 4 titles, CTA buttons
- **About** — circular photo (1725520706842.jpeg), spinning conic gradient ring, animated stat counters
- **Skills** — hexagonal clip-path grid, cyan glow on hover, stagger animation
- **Experience** — vertical timeline, glowing cyan centre line, alternating slide-in cards
- **Certifications** — badge grid, geometric SVG icons, amber shimmer on hover
- **Contact** — dark card form, cyan focus states, animated submit button

## DNS Records (Porkbun)
- 4 x A records → 185.199.108.153 / .109 / .110 / .111
- CNAME: www → hemantch.github.io
- Existing records kept: TXT, MX, wildcard CNAME (uixie.porkbun.com)

## next.config.ts
```ts
output: 'export'
images: { unoptimized: true }
trailingSlash: true
```

## GitHub Actions
- Workflow: .github/workflows/deploy.yml
- Triggers on push to main
- Build → upload artifact → deploy to github-pages environment
- Pages source: GitHub Actions (not branch)

## Current State (as of 2026-04-13)
- Domain connected and HTTPS enforced ✅
- GitHub Actions workflow created and ran successfully ✅
- Site live at hemanthchappa.com ✅
- First draft portfolio built with all sections ✅
- Photo integrated with spinning cyan ring ✅
- AGENTS.md updated in repo ✅
- public/CNAME file added (hemanthchappa.com) ✅
- Repo visibility changed to public (required for free GitHub Pages + Actions) ✅

## Deployment Fix Notes (2026-04-13)
- Root cause: repo was **private** — GitHub Pages with Actions deployment requires public repo on free plan
- Fix 1: Changed repo visibility to public (Settings → Danger Zone)
- Fix 2: Re-enabled Pages source as "GitHub Actions" (Settings → Pages)
- Fix 3: Added `public/CNAME` file with `hemanthchappa.com` to persist custom domain across deploys
- Claude Code auth was broken (401 error) — fixed manually via terminal commands

## Outstanding Items
1. **Hero font** — still looks cartoonish/Word document. Target: font-syne font-black, #F0F0F0, letterSpacing -0.04em, lineHeight 0.9 — matte flat Swiss feel
2. **Skills section** — replace hexagonal grid with achievement/metrics content (numbers-based)
3. **Projects section** — add Parsepod + portfolio site as showcased work
4. **Contact form** — wire up via Formspree (no backend needed)
5. **Motion animations** — scroll-triggered fade-up entrances audit
6. **Full design review** — section by section polish pass (one section at a time)
7. **Personal touch** — hobbies/interests section (deferred by Hemanth)
