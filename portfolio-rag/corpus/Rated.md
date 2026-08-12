# Rated

> Post your fit. Get Rated.

An outfit rating social network where users post photos of their actual outfits and the community rates and comments on them.

## Status: Ideation / Pre-MVP

## Concept

- Users post selfies/mirror pics of their outfits (self-submitted only)
- Community rates fits (star-based) and leaves feedback
- Trending feed surfaces top-rated looks
- Tag by occasion (Casual, Work, Night Out, Date, Festival, Gym, Street, Formal) and style (Minimalist, Streetwear, Classic, Boho, Avant-Garde, Preppy, Grunge, Cottagecore)
- Weekly themed challenges to drive engagement ("Monday Workwear", "Friday Night Out")

## Why This / Market Gap

- **Combyne** (10M+ installs) is the closest competitor but focuses on virtual outfit creation (mixing brand items on a canvas), not real outfit photos + structured feedback
- **Acloset, Whering, Indyx** all have social features but are primarily wardrobe management tools — no real rating mechanic
- **Reddit** (r/malefashionadvice, r/streetwear WAYWT threads) proves demand exists but lives on a platform not designed for it
- No dominant "post your actual outfit → get community ratings" social network exists
- Outfit planner app market projected to reach $450M by 2033 (13.5% CAGR)

## Naming

Explored several names before landing on **Rated**:
- ~~Outfitted~~ — taken by multiple apps (getoutfitted.app, Outfitted AI on App Store, Vega award winner)
- ~~Drapr~~ — was a YC S20 virtual try-on startup, acquired by Gap Inc. in 2021
- ~~Flaunt~~ — saturated (Flaunt Magazine owns flaunt.com, letsflaunt.com is an AI marketing platform, plus Flaunt Boutique app)
- ~~FitCheck~~ — too close to fitness apps
- **Rated** — short, bold, no direct competitor in fashion/outfit space. Works as verb + adjective. Domain options: getrated.app, rated.fashion, ratedapp.com

## Planned Stack

- **Expo** (React Native, managed workflow) — mobile-first, iOS + Android + web
- **Supabase** — auth, Postgres DB, image storage
- **Expo Router** — file-based tab navigation (Feed, Trending, Upload, Profile)

## Core Loop

**Post → Rate → Discover**

1. User snaps outfit photo, tags occasion + style, adds caption
2. Community rates (1-5 stars) + optional text feedback
3. Top-rated fits surface on trending feed

## V1 Scope (MVP)

- Auth (email magic link or Google OAuth)
- Photo upload to Supabase Storage
- Feed screen with real posts from DB
- Star rating that writes back to DB
- Trending page (sorted by avg rating)
- User profiles with post grid + stats
- Basic moderation (image moderation, report/block, community guidelines)

## V2+ Ideas

- AI-powered style-tribe clustering and personalised feed ranking
- "Outfits like yours that scored well" recommendations
- Weekly challenge system with leaderboards
- Brand partnerships / local boutique sponsored challenges
- Affiliate links on tagged items

## Key Risks

- **Cold start problem** — seed via uni fashion societies in Glasgow, Reddit/Discord fashion communities, themed challenges
- **Moderation** — people posting photos of themselves + public ratings = must have image moderation (AWS Rekognition or NSFW classifier), reporting/blocking, and clear guidelines from day one
- **Retention** — rating loop must feel rewarding, not judgmental

## Repo

`~/dev/rated/`

## Inspiration

- Combyne, r/malefashionadvice, r/streetwear WAYWT threads
