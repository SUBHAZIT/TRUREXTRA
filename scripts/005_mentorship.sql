-- Enable required extension for UUID generation
create extension if not exists "pgcrypto";

-- Mentor sessions table (mentors host sessions)
create table if not exists public.mentor_sessions (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  scheduled_at timestamptz,
  created_at timestamptz not null default now()
);

-- Mentor requests table (students request sessions with mentors)
create table if not exists public.mentor_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  mentor_id uuid not null references auth.users(id) on delete cascade,
  message text,
  status text not null default 'pending', -- pending | accepted | declined
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.mentor_sessions enable row level security;
alter table public.mentor_requests enable row level security;

-- Policies: mentors can manage their own sessions
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'mentor_sessions' and policyname = 'select_own_sessions'
  ) then
    create policy select_own_sessions on public.mentor_sessions
      for select using (auth.uid() = mentor_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'mentor_sessions' and policyname = 'insert_own_sessions'
  ) then
    create policy insert_own_sessions on public.mentor_sessions
      for insert with check (auth.uid() = mentor_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'mentor_sessions' and policyname = 'update_own_sessions'
  ) then
    create policy update_own_sessions on public.mentor_sessions
      for update using (auth.uid() = mentor_id) with check (auth.uid() = mentor_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'mentor_sessions' and policyname = 'delete_own_sessions'
  ) then
    create policy delete_own_sessions on public.mentor_sessions
      for delete using (auth.uid() = mentor_id);
  end if;
end $$;

-- Policies: students create requests for a mentor; mentors can view requests to them; students can see their own
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'mentor_requests' and policyname = 'select_own_or_to_me'
  ) then
    create policy select_own_or_to_me on public.mentor_requests
      for select using (auth.uid() = student_id or auth.uid() = mentor_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'mentor_requests' and policyname = 'insert_student_self'
  ) then
    create policy insert_student_self on public.mentor_requests
      for insert with check (auth.uid() = student_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'mentor_requests' and policyname = 'update_participants'
  ) then
    create policy update_participants on public.mentor_requests
      for update using (auth.uid() = student_id or auth.uid() = mentor_id)
      with check (auth.uid() = student_id or auth.uid() = mentor_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'mentor_requests' and policyname = 'delete_participants'
  ) then
    create policy delete_participants on public.mentor_requests
      for delete using (auth.uid() = student_id or auth.uid() = mentor_id);
  end if;
end $$;
