-- Create profiles table tied to Supabase auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text check (role in ('student','mentor','recruiter','organizer','investor','institute')),
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies: users can manage only their own profile
create policy if not exists "Profiles: select own" on public.profiles
for select using (auth.uid() = id);

create policy if not exists "Profiles: insert own" on public.profiles
for insert with check (auth.uid() = id);

create policy if not exists "Profiles: update own" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);
