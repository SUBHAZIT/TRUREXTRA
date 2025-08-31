create table if not exists public.skills (
  id bigserial primary key,
  slug text unique not null,
  name text not null
);

create table if not exists public.user_skills (
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id bigint not null references public.skills(id) on delete cascade,
  level int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, skill_id)
);

create table if not exists public.mcq_questions (
  id bigserial primary key,
  skill_id bigint not null references public.skills(id) on delete cascade,
  question text not null,
  options jsonb not null, -- ["A", "B", "C", "D"]
  correct_index int not null check (correct_index between 0 and 7),
  difficulty text default 'medium'
);

create table if not exists public.mcq_attempts (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id bigint not null references public.skills(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  score int
);

create table if not exists public.mcq_answers (
  attempt_id bigint not null references public.mcq_attempts(id) on delete cascade,
  question_id bigint not null references public.mcq_questions(id) on delete cascade,
  selected_index int not null,
  correct boolean not null,
  primary key (attempt_id, question_id)
);

-- RLS
alter table public.user_skills enable row level security;
alter table public.mcq_attempts enable row level security;
alter table public.mcq_answers enable row level security;
alter table public.skills enable row level security;
alter table public.mcq_questions enable row level security;

-- skills and question bank readable by all authenticated
drop policy if exists "skills_read_all" on public.skills;
create policy "skills_read_all" on public.skills for select to authenticated using (true);

drop policy if exists "mcq_questions_read_all" on public.mcq_questions;
create policy "mcq_questions_read_all" on public.mcq_questions for select to authenticated using (true);

-- user skills only by owner
drop policy if exists "user_skills_crud_own" on public.user_skills;
create policy "user_skills_crud_own"
on public.user_skills
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- attempts/answers only by owner
drop policy if exists "mcq_attempts_crud_own" on public.mcq_attempts;
create policy "mcq_attempts_crud_own"
on public.mcq_attempts
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "mcq_answers_crud_own" on public.mcq_answers;
create policy "mcq_answers_crud_own"
on public.mcq_answers
for all
to authenticated
using (exists (select 1 from public.mcq_attempts a where a.id = attempt_id and a.user_id = auth.uid()))
with check (exists (select 1 from public.mcq_attempts a where a.id = attempt_id and a.user_id = auth.uid()));
