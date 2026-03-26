<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Hemanth Chappa Portfolio

## Project Overview
Personal portfolio website for Hemanth Chappa,
Site Reliability Engineer with 9 years experience
based in Glasgow, UK.

## Live URL
https://hemanthchappa.com

## Tech Stack
- Next.js 16 with TypeScript
- Tailwind CSS v4 (config is in globals.css @theme, NOT tailwind.config.js — that file does not exist)
- Motion (Framer Motion) - import from 'motion/react'
- @fontsource/syne (400, 600, 700, 800)
- @fontsource/inter (400, 500, 600)
- react-intersection-observer
- Static export for GitHub Pages

## Design System
- Background: #0A0A0F
- Primary accent: #00D4FF (electric cyan)
- Secondary highlight: #F5A623 (amber)
- Muted text: #94A3B8
- Text primary: white
- Font headings: Syne (font-syne class, defined via --font-syne in globals.css @theme)
- Font body: Inter (font-inter class, defined via --font-inter in globals.css @theme)
- Vibe: Bold, creative, dark, techy "infrastructure at scale"

## Component Structure
src/
  app/
    layout.tsx — fonts, metadata, global styles
    page.tsx — imports all sections in order
    globals.css — Tailwind v4 @theme tokens and base styles
  components/
    Navbar.tsx — transparent top, blur on scroll
    Hero.tsx — particle network canvas, typewriter
    About.tsx — split layout, photo with spinning
      cyan ring, animated stat counters
    Skills.tsx — hexagonal grid, cyan glow on hover
    Experience.tsx — vertical timeline, alternating
      cards, glowing centre line
    Certifications.tsx — badge grid, amber shimmer
    Contact.tsx — dark card form, cyan focus states

## Photo
- File: /public/1725520706842.jpeg
- Used in: About.tsx as Next.js Image component
- Style: circular frame, spinning conic gradient
  ring, ambient cyan glow halo

## GitHub
- Username: hemantch
- Repo: portfolio (or whatever was created)
- Branch: main
- Hosting: GitHub Pages with custom domain

## Static Export Config
next.config.ts has:
- output: 'export'
- images: { unoptimized: true }
- trailingSlash: true

## Deployment
- Build: npm run build (generates /out folder)
- GitHub Pages serves from main branch
- Custom domain: hemanthchappa.com configured
  in Porkbun DNS with 4 A records + CNAME

## Pending Design Tasks
- Hero h1 "Hemanth Chappa" font needs refinement
  - Should be matte, flat, heavy, Swiss design feel
  - No gradients, glows or shine effects
  - font-syne font-black #F0F0F0
  - letterSpacing: -0.04em, lineHeight: 0.9
- Overall design open to creative refinement
- Personal touch / hobbies section to be
  revisited later
- Contact form functionality not yet wired up

## Sections Order
1. Navbar
2. Hero
3. About
4. Skills
5. Experience
6. Certifications
7. Contact / Footer

## Important Notes for AI Agents
- Tailwind v4: no tailwind.config.ts — all custom tokens (colors, fonts) live in the @theme block in src/app/globals.css
- All animations use Motion imported from 'motion/react' not 'framer-motion'
- react-intersection-observer used for scroll-triggered counter animations in About.tsx
- Mobile responsive throughout
- No lorem ipsum anywhere — all real content
- font-syne and font-inter are Tailwind utility classes generated from @theme variables, not from a config file
- Before modifying any component, read it first
- Read node_modules/next/dist/docs/ guides before using any Next.js API
