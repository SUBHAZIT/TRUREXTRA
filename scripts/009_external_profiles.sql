-- add external_profiles table with RLS so users can save their integration handles/URLs
create table if not exists public.external_profiles (
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  handle text,
  url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, provider)
);

alter table public.external_profiles enable row level security;

create policy "select own external profiles"
  on public.external_profiles for select
  using (auth.uid() = user_id);

create policy "insert own external profiles"
  on public.external_profiles for insert
  with check (auth.uid() = user_id);

create policy "update own external profiles"
  on public.external_profiles for update
  using (auth.uid() = user_id);

create policy "delete own external profiles"
  on public.external_profiles for delete
  using (auth.uid() = user_id);
