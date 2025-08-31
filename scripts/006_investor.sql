-- add investor tables with RLS (startups, investor_interests)
create extension if not exists "pgcrypto";

create table if not exists public.startups (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  stage text,
  created_at timestamptz not null default now()
);

create table if not exists public.investor_interests (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  note text,
  created_at timestamptz not null default now()
);

alter table public.startups enable row level security;
alter table public.investor_interests enable row level security;

-- startups: allow all authenticated to read; only owner can write/update/delete
do $$ begin
  if not exists (select 1 from pg_policies where tablename='startups' and policyname='startups_select_all_auth') then
    create policy startups_select_all_auth on public.startups
      for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename='startups' and policyname='startups_insert_owner') then
    create policy startups_insert_owner on public.startups
      for insert with check (auth.uid() = created_by);
  end if;
  if not exists (select 1 from pg_policies where tablename='startups' and policyname='startups_update_owner') then
    create policy startups_update_owner on public.startups
      for update using (auth.uid() = created_by) with check (auth.uid() = created_by);
  end if;
  if not exists (select 1 from pg_policies where tablename='startups' and policyname='startups_delete_owner') then
    create policy startups_delete_owner on public.startups
      for delete using (auth.uid() = created_by);
  end if;
end $$;

-- investor_interests: only the investor can see/manage their own interests
do $$ begin
  if not exists (select 1 from pg_policies where tablename='investor_interests' and policyname='interests_select_own') then
    create policy interests_select_own on public.investor_interests
      for select using (auth.uid() = investor_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='investor_interests' and policyname='interests_insert_self') then
    create policy interests_insert_self on public.investor_interests
      for insert with check (auth.uid() = investor_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='investor_interests' and policyname='interests_update_self') then
    create policy interests_update_self on public.investor_interests
      for update using (auth.uid() = investor_id) with check (auth.uid() = investor_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='investor_interests' and policyname='interests_delete_self') then
    create policy interests_delete_self on public.investor_interests
      for delete using (auth.uid() = investor_id);
  end if;
end $$;
