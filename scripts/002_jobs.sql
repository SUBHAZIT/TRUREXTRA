-- jobs table for recruiters with RLS
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  location text,
  job_type text,
  created_at timestamptz default now()
);

alter table public.jobs enable row level security;

-- Anyone (authed) can read jobs
create policy if not exists "jobs select all" on public.jobs
for select
to authenticated
using (true);

-- Only owner can insert/update/delete their jobs
create policy if not exists "jobs insert own" on public.jobs
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy if not exists "jobs update own" on public.jobs
for update
to authenticated
using (auth.uid() = owner_id);

create policy if not exists "jobs delete own" on public.jobs
for delete
to authenticated
using (auth.uid() = owner_id);
