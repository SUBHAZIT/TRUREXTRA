-- Enable useful extensions (allowed in Supabase)
create extension if not exists pgcrypto;

-- User roles used across the app
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('student','mentor','recruiter','organizer','investor','institute');
  end if;
end $$;
