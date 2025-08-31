-- USERS/PROFILES
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text check (role in ('STUDENT','MENTOR','RECRUITER','ORGANIZER','INVESTOR','COLLEGE')),
  created_at timestamp with time zone default now()
);

-- CONNECTIONS (EXTERNAL ACCOUNTS LIKE LEETCODE/UNSTOP/LINKEDIN)
create table if not exists connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  provider text not null, -- 'LEETCODE' | 'UNSTOP' | 'LINKEDIN'
  access_token text,
  refresh_token text,
  expires_at bigint,
  created_at timestamp with time zone default now()
);

-- SKILLS & ASSESSMENTS
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  created_at timestamp with time zone default now()
);

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  skill text not null,
  score int,
  passed boolean default false,
  created_at timestamp with time zone default now()
);

-- MEETINGS (MENTORING)
create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid references profiles(id) on delete set null,
  student_id uuid references profiles(id) on delete set null,
  scheduled_at timestamp with time zone,
  meeting_link text,
  created_at timestamp with time zone default now()
);

-- EVENTS/HACKATHONS (ORGANIZER, COLLEGE)
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references profiles(id) on delete set null,
  title text not null,
  mode text check (mode in ('ONLINE','OFFLINE')) default 'ONLINE',
  starts_at timestamp with time zone,
  ends_at timestamp with time zone,
  location text,
  created_at timestamp with time zone default now()
);

create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  attendee_id uuid references profiles(id) on delete set null,
  checked_at timestamp with time zone default now(),
  qr_code text
);

-- RECRUITING (RECRUITER)
create table if not exists job_posts (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid references profiles(id) on delete set null,
  title text not null,
  description text,
  created_at timestamp with time zone default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references job_posts(id) on delete cascade,
  candidate_id uuid references profiles(id) on delete cascade,
  resume_url text,
  status text check (status in ('NEW','SHORTLISTED','REJECTED','INTERVIEWING','HIRED')) default 'NEW',
  created_at timestamp with time zone default now()
);

-- RLS
alter table profiles enable row level security;
alter table connections enable row level security;
alter table skills enable row level security;
alter table assessments enable row level security;
alter table meetings enable row level security;
alter table events enable row level security;
alter table checkins enable row level security;
alter table job_posts enable row level security;
alter table applications enable row level security;

create policy "select own profile" on profiles for select using (auth.uid() = id);
create policy "update own profile" on profiles for update using (auth.uid() = id);
create policy "insert own profile" on profiles for insert with check (auth.uid() = id);

create policy "user owns rows" on connections for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "user owns rows" on skills for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "user owns rows" on assessments for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "mentor/meeting visibility" on meetings for select using (mentor_id = auth.uid() or student_id = auth.uid());
create policy "organizer visibility" on events for select using (organizer_id = auth.uid());
create policy "recruiter owns posts" on job_posts for all using (recruiter_id = auth.uid()) with check (recruiter_id = auth.uid());
create policy "candidate owns application" on applications for all using (candidate_id = auth.uid()) with check (candidate_id = auth.uid());
