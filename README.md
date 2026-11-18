# NEXUS AI/ML Tracker — Simple Supabase setup

## Files
- `index.html` — tracker UI, automatic `data.json` fetch, Supabase Auth and progress save/load.
- `data.json` — 12-week curriculum.
- `supabase_schema.sql` — one simple progress table with RLS disabled.

## Setup
1. In Supabase, open SQL Editor and run `supabase_schema.sql`.
2. In Supabase Authentication settings, configure email confirmation as desired.
3. Publish `index.html` and `data.json` in the same GitHub Pages folder.
4. Open the page, enter your Supabase Project URL and publishable key (or legacy anon key). These are stored in that browser.
5. Register and use the tracker.

## Important no-RLS warning
This version deliberately disables RLS as requested. The SQL grants table access to the `authenticated` role only, so users must sign in first. However, because RLS is disabled, every authenticated user with these grants can read, insert, update, or delete every row in `nexus_progress` through the Data API. The browser UI filters by the signed-in user's ID, but that is not a security boundary. Use only for a trusted test/demo group and do not store sensitive information. For a public multi-user product, enable RLS with per-user policies.

Passwords are handled by Supabase Auth and are not stored in the progress table. Never put a service-role key in HTML.
