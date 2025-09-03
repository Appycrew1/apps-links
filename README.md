# Appy Link (Next.js)

Linking movers with suppliers — UK directory with favorites, compare, and AI comparison.

## Quick start

1. **Install**
```bash
npm i
```

2. **Env vars** (Vercel → Project → Settings → Environment Variables)
```
NEXT_PUBLIC_SUPABASE_URL = https://<your-supabase>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = <anon-key>
AI_API_URL = https://api.openai.com/v1/chat/completions   # or your own
AI_API_KEY = <key>
AI_MODEL = gpt-4o-mini
```

3. **Load live data** (in Supabase → SQL Editor) using `supabase/seed.sql`

4. **Run**
```bash
npm run dev
```

Visit:
- `/providers` – browse suppliers
- `/favorites` – saved suppliers
- `/compare` – compare up to 3 suppliers + AI comparison

## Notes
- The app prefers **live Supabase data** and falls back to tiny seeds if Supabase env is missing.
- Buttons (Save/Favorite, Compare) persist in localStorage.
- AI compare calls `/api/compare` which forwards to your AI endpoint.
