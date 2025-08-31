create table if not exists public.communities (
  id bigserial primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.community_members (
  community_id bigint not null references public.communities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

create table if not exists public.meetings (
  id bigserial primary key,
  mentor_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_mins int not null default 30,
  meet_url text,
  status text not null default 'scheduled', -- scheduled|completed|cancelled
  created_at timestamptz not null default now()
);

-- RLS
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.meetings enable row level security;

-- Community visibility: owner and members
drop policy if exists "communities_read_members_only" on public.communities;
create policy "communities_read_members_only"
on public.communities for select
to authenticated
using (
  owner_id = auth.uid()
  or exists (select 1 from public.community_members m where m.community_id = id and m.user_id = auth.uid())
);

-- Community manage: owner only
drop policy if exists "communities_owner_crud" on public.communities;
create policy "communities_owner_crud"
on public.communities for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

-- Community members: member can read own row; owner can manage
drop policy if exists "community_members_read_own" on public.community_members;
create policy "community_members_read_own"
on public.community_members for select
to authenticated
using (user_id = auth.uid() or exists (select 1 from public.communities c where c.id = community_id and c.owner_id = auth.uid()));

drop policy if exists "community_members_owner_crud" on public.community_members;
create policy "community_members_owner_crud"
on public.community_members for all
to authenticated
using (exists (select 1 from public.communities c where c.id = community_id and c.owner_id = auth.uid()))
with check (exists (select 1 from public.communities c where c.id = community_id and c.owner_id = auth.uid()));

-- Meetings visible to participants
drop policy if exists "meetings_participants_crud" on public.meetings;
create policy "meetings_participants_crud"
on public.meetings
for all
to authenticated
using (mentor_id = auth.uid() or student_id = auth.uid())
with check (mentor_id = auth.uid() or student_id = auth.uid());
