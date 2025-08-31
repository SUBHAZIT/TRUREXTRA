create table if not exists public.companies (
  id bigserial primary key,
  name text not null,
  website text,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.company_members (
  company_id bigint not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'recruiter',
  primary key (company_id, user_id)
);

create table if not exists public.job_posts (
  id bigserial primary key,
  company_id bigint not null references public.companies(id) on delete cascade,
  title text not null,
  description text not null,
  location text,
  employment_type text,
  remote boolean default true,
  status text not null default 'draft', -- draft|published|closed
  created_by uuid not null references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id bigserial primary key,
  job_id bigint not null references public.job_posts(id) on delete cascade,
  applicant_id uuid not null references auth.users(id) on delete cascade,
  cv_url text,
  cover_letter text,
  status text not null default 'submitted', -- submitted|review|rejected|accepted
  created_at timestamptz not null default now()
);

create table if not exists public.screening_results (
  id bigserial primary key,
  application_id bigint not null references public.applications(id) on delete cascade,
  score int,
  notes text,
  ai_summary jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.interviews (
  id bigserial primary key,
  application_id bigint not null references public.applications(id) on delete cascade,
  interviewer_id uuid not null references auth.users(id) on delete set null,
  scheduled_at timestamptz not null,
  meeting_url text,
  status text not null default 'scheduled',
  created_at timestamptz not null default now()
);

-- RLS
alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.job_posts enable row level security;
alter table public.applications enable row level security;
alter table public.screening_results enable row level security;
alter table public.interviews enable row level security;

-- Company: owner and members can read/manage
create policy if not exists "companies_read_member_or_owner" on public.companies for select to authenticated using (
  owner_id = auth.uid() or exists (select 1 from public.company_members cm where cm.company_id = id and cm.user_id = auth.uid())
);
create policy if not exists "companies_owner_crud" on public.companies for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Company members: owner manage; member can read own row
create policy if not exists "company_members_read" on public.company_members for select to authenticated using (
  user_id = auth.uid() or exists (select 1 from public.companies c where c.id = company_id and c.owner_id = auth.uid())
);
create policy if not exists "company_members_owner_crud" on public.company_members for all to authenticated using (
  exists (select 1 from public.companies c where c.id = company_id and c.owner_id = auth.uid())
) with check (
  exists (select 1 from public.companies c where c.id = company_id and c.owner_id = auth.uid())
);

-- Job posts: published visible to all authenticated; company members manage
create policy if not exists "job_posts_read_published_or_member" on public.job_posts for select to authenticated using (
  status = 'published'
  or exists (select 1 from public.company_members cm where cm.company_id = company_id and cm.user_id = auth.uid())
  or exists (select 1 from public.companies c where c.id = company_id and c.owner_id = auth.uid())
);
create policy if not exists "job_posts_member_crud" on public.job_posts for all to authenticated using (
  exists (select 1 from public.company_members cm where cm.company_id = company_id and cm.user_id = auth.uid())
  or exists (select 1 from public.companies c where c.id = company_id and c.owner_id = auth.uid())
) with check (
  exists (select 1 from public.company_members cm where cm.company_id = company_id and cm.user_id = auth.uid())
  or exists (select 1 from public.companies c where c.id = company_id and c.owner_id = auth.uid())
);

-- Applications: applicant and company members can view; applicant can create/update own
create policy if not exists "applications_read_applicant_or_member" on public.applications for select to authenticated using (
  applicant_id = auth.uid()
  or exists (
    select 1 from public.job_posts j
    join public.company_members cm on cm.company_id = j.company_id
    where j.id = job_id and cm.user_id = auth.uid()
  )
);
create policy if not exists "applications_applicant_crud" on public.applications for all to authenticated using (
  applicant_id = auth.uid()
) with check (applicant_id = auth.uid());

-- Screening results/interviews: visible to applicant and company members
create policy if not exists "screening_read_applicant_or_member" on public.screening_results for select to authenticated using (
  exists (select 1 from public.applications a where a.id = application_id and (a.applicant_id = auth.uid()
    or exists (select 1 from public.job_posts j join public.company_members cm on cm.company_id = j.company_id where j.id = a.job_id and cm.user_id = auth.uid())))
);
create policy if not exists "interviews_read_applicant_or_member" on public.interviews for select to authenticated using (
  exists (select 1 from public.applications a where a.id = application_id and (a.applicant_id = auth.uid()
    or exists (select 1 from public.job_posts j join public.company_members cm on cm.company_id = j.company_id where j.id = a.job_id and cm.user_id = auth.uid())))
);

-- Members manage screening and interviews
create policy if not exists "screening_member_crud" on public.screening_results for all to authenticated using (
  exists (select 1 from public.applications a join public.job_posts j on j.id = a.job_id join public.company_members cm on cm.company_id = j.company_id where a.id = application_id and cm.user_id = auth.uid())
) with check (
  exists (select 1 from public.applications a join public.job_posts j on j.id = a.job_id join public.company_members cm on cm.company_id = j.company_id where a.id = application_id and cm.user_id = auth.uid())
);
create policy if not exists "interviews_member_crud" on public.interviews for all to authenticated using (
  exists (select 1 from public.applications a join public.job_posts j on j.id = a.job_id join public.company_members cm on cm.company_id = j.company_id where a.id = application_id and cm.user_id = auth.uid())
) with check (
  exists (select 1 from public.applications a join public.job_posts j on j.id = a.job_id join public.company_members cm on cm.company_id = j.company_id where a.id = application_id and cm.user_id = auth.uid())
);
