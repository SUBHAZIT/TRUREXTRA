create table if not exists public.institutes (
  id bigserial primary key,
  name text not null,
  domain text,
  admin_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.institute_members (
  institute_id bigint not null references public.institutes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'student', -- student|faculty|admin
  primary key (institute_id, user_id)
);

-- RLS
alter table public.institutes enable row level security;
alter table public.institute_members enable row level security;

-- Institute: admin reads/manages
create policy if not exists "institutes_admin_crud" on public.institutes for all to authenticated using (admin_id = auth.uid()) with check (admin_id = auth.uid());
create policy if not exists "institutes_admin_read" on public.institutes for select to authenticated using (admin_id = auth.uid());

-- Members: user can read own membership; admin manages
create policy if not exists "institute_members_read" on public.institute_members for select to authenticated using (
  user_id = auth.uid() or exists (select 1 from public.institutes i where i.id = institute_id and i.admin_id = auth.uid())
);
create policy if not exists "institute_members_admin_crud" on public.institute_members for all to authenticated using (
  exists (select 1 from public.institutes i where i.id = institute_id and i.admin_id = auth.uid())
) with check (
  exists (select 1 from public.institutes i where i.id = institute_id and i.admin_id = auth.uid())
);
