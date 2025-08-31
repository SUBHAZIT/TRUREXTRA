-- Profiles mapped 1:1 to auth.users
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'student',
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- When a new auth user is created, create a profile row using raw_user_meta_data
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
declare
  meta jsonb;
  v_role text;
  v_name text;
begin
  meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_role := (meta->>'role');
  v_name := (meta->>'full_name');

  insert into public.profiles (user_id, role, full_name)
  values (
    new.id,
    coalesce(nullif(v_role, '')::public.user_role, 'student'),
    nullif(v_name, '')
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Attach trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

-- The owner can select/update their profile
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Insert is handled by trigger; deny direct inserts by default (no insert policy)
