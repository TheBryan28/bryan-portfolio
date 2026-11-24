# Bryan Cruz · Portfolio

Personal site of Bryan Cruz, full-stack AI engineer. Live at https://bryan-dev-portfolio-sand.vercel.app

Two views share the same data:

- **Modern view** (default): hero, AI assistant, experience timeline, projects, stack and contact. Animations use GSAP (SplitText, ScrollTrigger) and a canvas "swarm" around the portrait.
- **Retro desktop**: the original Windows-style desktop, now with a real AI terminal. Open it from the header, or go to `/#retro`.

## AI assistant

The assistant answers only from `src/data/profile.ts`.

1. If the visitor's Chrome has **Gemini Nano** (built-in Prompt API, Chrome 148+ on desktop), answers are generated on the device.
2. Otherwise the browser calls `api/chat.ts`, a Vercel Function that streams an answer from the **Gemini API**. The API key stays on the server.

Code: `src/ai/engine.ts` (routing and fallback), `src/ai/knowledge.ts` (system prompt), `api/chat.ts` (cloud fallback).

## Run locally

```bash
npm install
cp .env.example .env.local   # then paste your Gemini API key
npm run dev
```

Open http://localhost:5173. `npm run dev` also serves `/api/chat`, so the cloud fallback works locally.

To try the on-device path, use Chrome 148+ on a desktop that meets the Gemini Nano requirements and check `chrome://on-device-internals`.

## Deploy

Vercel builds every push to `main`. Set these in **Vercel > Project > Settings > Environment Variables**:

| Name | Value |
|---|---|
| `GEMINI_API_KEY` | Your key from Google AI Studio |
| `GEMINI_MODEL` | Optional. Defaults to `gemini-3.5-flash-lite` |

## Update the content

Edit `src/data/profile.ts`, and replace `public/Bryan_Cruz_Resume.pdf` when the resume changes.
