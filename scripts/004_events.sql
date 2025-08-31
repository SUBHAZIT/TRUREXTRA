create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  venue text,
  start_at timestamptz,
  created_at timestamptz default now()
);

alter table public.events enable row level security;

-- Select all events by authenticated users (adjust as needed)
create policy if not exists "events select all" on public.events
for select
to authenticated
using (true);

-- Only owner can insert/update/delete their own events
create policy if not exists "events insert own" on public.events
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy if not exists "events update own" on public.events
for update
to authenticated
using (auth.uid() = owner_id);

create policy if not exists "events delete own" on public.events
for delete
to authenticated
using (auth.uid() = owner_id);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  attendee_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (event_id, attendee_id)
);

alter table public.checkins enable row level security;

-- Attendee can insert/select their own check-ins
create policy if not exists "checkins insert own" on public.checkins
for insert
to authenticated
with check (auth.uid() = attendee_id);

create policy if not exists "checkins select own" on public.checkins
for select
to authenticated
using (auth.uid() = attendee_id);

-- Event owner can view all check-ins for their events
create policy if not exists "checkins select by owner" on public.checkins
for select
to authenticated
using (exists (select 1 from public.events e where e.id = checkins.event_id and e.owner_id = auth.uid()));

-- Event owner can update status (if needed later)
create policy if not exists "checkins update by owner" on public.checkins
for update
to authenticated
using (exists (select 1 from public.events e where e.id = checkins.event_id and e.owner_id = auth.uid()));
