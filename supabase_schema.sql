-- NEXUS AI/ML tracker: simple progress table, with Row Level Security disabled.
-- User registration/login is handled by Supabase Auth (not by storing passwords in this table).

create table if not exists public.nexus_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.nexus_progress disable row level security;

-- Allow signed-in users to use the table through the Supabase Data API.
-- IMPORTANT: With RLS disabled, any authenticated user who has these grants
-- can read or change EVERY row in this table. Do not store private data here.
grant select, insert, update, delete on public.nexus_progress to authenticated;
