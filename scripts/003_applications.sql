-- applications table with RLS for applicants and job owners
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  applicant_id uuid not null references auth.users(id) on delete cascade,
  cover_letter text,
  status text default 'submitted',
  created_at timestamptz default now(),
  unique (job_id, applicant_id)
);

alter table public.applications enable row level security;

-- Applicants can insert/select their own applications
create policy if not exists "applications insert own" on public.applications
for insert
to authenticated
with check (auth.uid() = applicant_id);

create policy if not exists "applications select own" on public.applications
for select
to authenticated
using (auth.uid() = applicant_id);

-- Job owners can see applications for their jobs
create policy if not exists "applications select by job owner" on public.applications
for select
to authenticated
using (exists (select 1 from public.jobs j where j.id = applications.job_id and j.owner_id = auth.uid()));

-- Job owners can update status
create policy if not exists "applications update by job owner" on public.applications
for update
to authenticated
using (exists (select 1 from public.jobs j where j.id = applications.job_id and j.owner_id = auth.uid()));
