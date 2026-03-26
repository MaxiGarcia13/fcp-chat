# Chat assistant for the **Liga Cantabra de Padel**.

## What it does

This project provides an AI-powered chat that can help you:

- Find team standings and rankings
- Get info about next week's matches
- Compare teams and highlight key differences
- Suggest weekly lineups / possible pairings for upcoming matches
- Answer general league/competition questions

The assistant is designed to stay within the league scope and to avoid inventing teams, matches, standings, players, or statistics.

## How it works

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file (see required variables below).

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the app at the Astro dev URL (typically `http://localhost:4321`).

## Environment variables

These are required for server-side execution (configured in `astro.config.mjs`):

- `API_URL`: base URL for the external scraper/service
- `API_KEY`: API key for the external scraper/service
- `GROQ_API_KEY`: credentials for `@ai-sdk/groq`
- `MCP_URL`: MCP endpoint (used to discover and call tools)
- `VERCEL_AUTOMATION_BYPASS_SECRET`: value used as `x-vercel-protection-bypass` when calling the MCP service

Do not commit real secrets to git. Add/keep `.env` ignored (this repo already has `.gitignore` configured for that).

## Production build

```bash
npm run build
npm run preview
```

The project uses the Vercel adapter (`@astrojs/vercel`) and `output: 'server'`.
