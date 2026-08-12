# Parsepod

## What It Is
AI-powered podcast generator. Takes a topic, researches it, and generates a full podcast episode with two hosts having a natural conversation, complete with audio output.

## Stack
- **Frontend:** Streamlit (hosted on Streamlit Cloud)
- **LLM:** Gemini 2.5 Flash (`gemini-2.5-flash`) via `google-genai` SDK — migrated from Groq on 2026-04-19
- **Search:** Tavily API (web research)
- **TTS:** Edge TTS (free, no API key needed)
  - Host A (Thomas): `en-GB-ThomasNeural`
  - Host B (Libby): `en-GB-LibbyNeural`
- **Audio:** pydub + ffmpeg
- **Repo:** github.com/hemantch/parsepod
- **Local path:** `~/dev/parsepod`

## Current State
- Full podcast generation pipeline working end to end
- **LLM migrated from Groq to Gemini 2.5 Flash** — this fixed the original Groq 12k TPM rate-limit issue. Script generation uses `response_mime_type="application/json"` for structured output.
- **TTS reverted to Edge TTS** after Gemini 3.1 Flash TTS Preview proved unviable on free tier (3 RPM hard limit). Per-turn synthesis with `edge-tts`, stitched by pydub.
- **Git tag `gemini-tts-snapshot`** preserves the full Gemini TTS migration (chunked multi-speaker, retry logic, checkpointing) if paid Tier 1 is ever justified.
- UI fully redesigned — dark broadcast studio aesthetic (Wondercraft-inspired structure)
  - Sticky frosted glass navbar: How it works, About, GitHub, Docs, Privacy, Launch Studio
  - Single centered column hero: badge, headline, subheadline, input box, host chips, CTA, waveform
  - Feature grid, How it works steps, FAQ accordion
  - Animated On Air loading state with per-stage progress ("Thomas · turn 3/18" UX)
  - Styled audio player on completion
- HTML rendering fixed: all stage HTML uses `st.markdown(..., unsafe_allow_html=True)`
- All Streamlit CSS overrides use `!important` declarations
- Host chips display Thomas and Libby (Ryan/Jenny references fixed during migration)
- UI references to Groq replaced with Gemini throughout (FAQ, How it works, descriptions)
- CLAUDE.md maintained in repo for Claude Code context persistence

## Known Issues / Watch Points
- Streamlit CSS overrides require `!important` declarations
- Python 3.13+ requires `audioop-lts` package
- ffmpeg must be listed in `packages.txt` for Streamlit Cloud
- TOML secrets format required for Streamlit Cloud env vars
- Empty commits needed to force redeployment on Streamlit Cloud
- Edge TTS uses undocumented Microsoft endpoints — stable for years but no official SLA
- GROQ_API_KEY still in local `.env` — safe to delete after confirming Gemini LLM works in production

## Migration History (2026-04-19)
- **Groq → Gemini LLM:** Replaced `llama-3.3-70b-versatile` with `gemini-2.5-flash`. Fixed the 12k TPM rate-limit issue that blocked 3-minute episodes. `groq` package removed from requirements.txt. `GEMINI_API_KEY` is now the only LLM key.
- **Edge TTS → Gemini 3.1 Flash TTS → Edge TTS (reverted):** Full migration to Gemini 3.1 Flash TTS Preview was completed (chunked multi-speaker, 5-retry backoff with jitter, content-hash checkpointing), but free tier proved unviable at 3 RPM. Reverted TTS to Edge TTS. Gemini TTS code preserved at git tag `gemini-tts-snapshot`.
- **Host names:** Ryan/Jenny → Thomas/Libby throughout codebase and UI.
- **Personality text:** Host B changed from "American female" to "British female" in prompts.py.
- **SDK:** Uses modern `google-genai` SDK (`from google import genai`), pinned `>=1.73.1`.

## Environment Variables
```env
GEMINI_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
PODCAST_NAME=Parsepod
HOST_A_NAME=Thomas
HOST_B_NAME=Libby
HOST_A_VOICE=en-GB-ThomasNeural
HOST_B_VOICE=en-GB-LibbyNeural
OUTPUT_DIR=./output
TEMP_DIR=./temp
EPISODE_DURATION_MINUTES=3
SILENCE_BETWEEN_TURNS_MS=450
```
Config priority: `st.secrets` (Streamlit Cloud) → `.env` → hard-coded default.

## Next Steps
- Run first end-to-end generation with hybrid stack (Gemini LLM + Edge TTS)
- Push to GitHub, deploy to Streamlit Cloud
- Update Streamlit Cloud secrets: replace GROQ_API_KEY with GEMINI_API_KEY
- Delete GROQ_API_KEY from local `.env` after confirming production works
- Consider upgrading to Gemini paid Tier 1 + Gemini TTS in future if Parsepod justifies it (tag: `gemini-tts-snapshot`)
