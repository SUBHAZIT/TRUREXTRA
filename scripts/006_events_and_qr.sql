create table if not exists public.events (
  id bigserial primary key,
  organizer_id uuid not null references auth.users(id) on delete cascade,
  institute_id bigint references public.institutes(id) on delete set null,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  mode text default 'online', -- online|offline|hybrid
  location text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.event_participants (
  event_id bigint not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'attendee', -- attendee|mentor|judge|organizer
  checked_in boolean not null default false,
  primary key (event_id, user_id)
);

create table if not exists public.qr_checkins (
  id bigserial primary key,
  event_id bigint not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  checked_at timestamptz not null default now(),
  method text default 'qr'
);

-- RLS
alter table public.events enable row level security;
alter table public.event_participants enable row level security;
alter table public.qr_checkins enable row level security;

-- Events readable to participants and published to all authenticated
create policy if not exists "events_read_published_or_participant" on public.events for select to authenticated using (
  is_published = true
  or organizer_id = auth.uid()
  or exists (select 1 from public.event_participants p where p.event_id = id and p.user_id = auth.uid())
);

-- Organizer manages own events
create policy if not exists "events_organizer_crud" on public.events for all to authenticated using (organizer_id = auth.uid()) with check (organizer_id = auth.uid());

-- Participants: user can read their row; organizer manages all
create policy if not exists "event_participants_read" on public.event_participants for select to authenticated using (
  user_id = auth.uid()
  or exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
);
create policy if not exists "event_participants_organizer_crud" on public.event_participants for all to authenticated using (
  exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
) with check (
  exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
);

-- QR checkins: organizer can read all; user can read own; organizer inserts checkins
create policy if not exists "qr_checkins_read" on public.qr_checkins for select to authenticated using (
  user_id = auth.uid()
  or exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
);
create policy if not exists "qr_checkins_organizer_insert" on public.qr_checkins for insert to authenticated with check (
  exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
);
