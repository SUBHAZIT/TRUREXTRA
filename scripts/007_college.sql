-- add college tables with RLS (college_programs, college_students)
create extension if not exists "pgcrypto";

create table if not exists public.college_programs (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.college_students (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid references public.college_programs(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.college_programs enable row level security;
alter table public.college_students enable row level security;

-- programs: only the college owner manages their programs; all authenticated can read program list
do $$ begin
  if not exists (select 1 from pg_policies where tablename='college_programs' and policyname='programs_select_all_auth') then
    create policy programs_select_all_auth on public.college_programs
      for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename='college_programs' and policyname='programs_insert_owner') then
    create policy programs_insert_owner on public.college_programs
      for insert with check (auth.uid() = college_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='college_programs' and policyname='programs_update_owner') then
    create policy programs_update_owner on public.college_programs
      for update using (auth.uid() = college_id) with check (auth.uid() = college_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='college_programs' and policyname='programs_delete_owner') then
    create policy programs_delete_owner on public.college_programs
      for delete using (auth.uid() = college_id);
  end if;
end $$;

-- college_students: college sees and manages their rows; student can read their own mapping
do $$ begin
  if not exists (select 1 from pg_policies where tablename='college_students' and policyname='college_students_select') then
    create policy college_students_select on public.college_students
      for select using (auth.uid() = college_id or auth.uid() = student_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='college_students' and policyname='college_students_insert_college') then
    create policy college_students_insert_college on public.college_students
      for insert with check (auth.uid() = college_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='college_students' and policyname='college_students_update_college') then
    create policy college_students_update_college on public.college_students
      for update using (auth.uid() = college_id) with check (auth.uid() = college_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='college_students' and policyname='college_students_delete_college') then
    create policy college_students_delete_college on public.college_students
      for delete using (auth.uid() = college_id);
  end if;
end $$;
