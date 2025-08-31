create table if not exists public.startups (
  id bigserial primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  stage text, -- idea|mvp|seed|series-a...
  website text,
  pitch_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.investment_interests (
  id bigserial primary key,
  investor_id uuid not null references auth.users(id) on delete cascade,
  startup_id bigint not null references public.startups(id) on delete cascade,
  amount numeric,
  message text,
  status text not null default 'interested', -- interested|in_discussion|closed
  created_at timestamptz not null default now()
);

-- RLS
alter table public.startups enable row level security;
alter table public.investment_interests enable row level security;

-- Startup: owner reads/manages; investors can read published listings later (add a published flag when needed)
create policy if not exists "startups_owner_crud" on public.startups for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy if not exists "startups_owner_read" on public.startups for select to authenticated using (owner_id = auth.uid());

-- Interests: investor and startup owner can read; investor manages their own interest
create policy if not exists "interests_read_parties" on public.investment_interests for select to authenticated using (
  investor_id = auth.uid()
  or exists (select 1 from public.startups s where s.id = startup_id and s.owner_id = auth.uid())
);
create policy if not exists "interests_investor_crud" on public.investment_interests for all to authenticated using (investor_id = auth.uid()) with check (investor_id = auth.uid());
