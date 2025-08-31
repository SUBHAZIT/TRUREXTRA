-- Add student-centric features: endorsements, connections, challenges, submissions, hackathon teams/submissions, badges
-- Extensions
create extension if not exists pgcrypto;

-- Endorsements
create table if not exists endorsements (
  id uuid primary key default gen_random_uuid(),
  endorsed_user uuid not null references auth.users(id) on delete cascade,
  endorser_user uuid not null references auth.users(id) on delete cascade,
  skill text not null check (length(skill) <= 64),
  created_at timestamptz not null default now(),
  unique (endorsed_user, endorser_user, skill)
);
alter table endorsements enable row level security;
do $$ begin
  create policy "endorsements_read_related" on endorsements for select using (
    auth.uid() = endorsed_user or auth.uid() = endorser_user
  );
  create policy "endorsements_insert_self" on endorsements for insert with check (auth.uid() = endorser_user);
  create policy "endorsements_delete_self" on endorsements for delete using (auth.uid() = endorser_user);
exception when duplicate_object then null; end $$;

-- Connections
create type connection_status as enum ('pending','accepted','rejected');
create table if not exists connections (
  id uuid primary key default gen_random_uuid(),
  requester uuid not null references auth.users(id) on delete cascade,
  addressee uuid not null references auth.users(id) on delete cascade,
  status connection_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (requester, addressee)
);
alter table connections enable row level security;
do $$ begin
  create policy "connections_read_related" on connections for select using (
    auth.uid() = requester or auth.uid() = addressee
  );
  create policy "connections_insert_self" on connections for insert with check (auth.uid() = requester);
  create policy "connections_update_related" on connections for update using (auth.uid() = requester or auth.uid() = addressee);
exception when duplicate_object then null; end $$;

-- Challenges
create type challenge_difficulty as enum ('Beginner','Intermediate','Advanced');
create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  difficulty challenge_difficulty not null default 'Beginner',
  prompt text not null,
  sample_input text,
  sample_output text,
  created_at timestamptz not null default now()
);
alter table challenges enable row level security;
do $$ begin
  create policy "challenges_read_all" on challenges for select using (true);
  create policy "challenges_insert_admin" on challenges for insert with check (false); -- only via service/admin if needed
exception when duplicate_object then null; end $$;

-- Submissions
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  language text not null default 'javascript',
  code text not null,
  passed boolean not null default false,
  score int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists submissions_user_idx on submissions(user_id);
create index if not exists submissions_challenge_idx on submissions(challenge_id);
alter table submissions enable row level security;
do $$ begin
  create policy "submissions_read_self" on submissions for select using (auth.uid() = user_id);
  create policy "submissions_insert_self" on submissions for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Badges
create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text
);
create table if not exists user_badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);
alter table badges enable row level security;
alter table user_badges enable row level security;
do $$ begin
  create policy "badges_read_all" on badges for select using (true);
  create policy "user_badges_read_self" on user_badges for select using (auth.uid() = user_id);
  create policy "user_badges_insert_self" on user_badges for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Hackathons based on existing events
create table if not exists hackathon_teams (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists team_members (
  team_id uuid not null references hackathon_teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (team_id, user_id)
);
create table if not exists hackathon_submissions (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references hackathon_teams(id) on delete cascade,
  repo_url text,
  demo_url text,
  description text,
  created_at timestamptz not null default now()
);
alter table hackathon_teams enable row level security;
alter table team_members enable row level security;
alter table hackathon_submissions enable row level security;
do $$ begin
  create policy "teams_read_related" on hackathon_teams for select using (
    exists (select 1 from team_members tm where tm.team_id = hackathon_teams.id and tm.user_id = auth.uid())
    or created_by = auth.uid()
  );
  create policy "teams_insert_self" on hackathon_teams for insert with check (created_by = auth.uid());
  create policy "team_members_read_self" on team_members for select using (user_id = auth.uid());
  create policy "team_members_insert_self" on team_members for insert with check (user_id = auth.uid());
  create policy "submissions_read_related" on hackathon_submissions for select using (
    exists (select 1 from team_members tm where tm.team_id = hackathon_submissions.team_id and tm.user_id = auth.uid())
  );
  create policy "submissions_insert_related" on hackathon_submissions for insert with check (
    exists (select 1 from team_members tm where tm.team_id = hackathon_submissions.team_id and tm.user_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

-- Seed a couple of badges and a starter challenge
insert into badges (slug, name, description)
  values ('first-solve','First Solve','Awarded for your first successful challenge.'),
         ('first-hackathon-submit','First Hackathon Submission','Awarded for your first hackathon project submission.')
on conflict (slug) do nothing;

insert into challenges (title, category, difficulty, prompt, sample_input, sample_output)
values ('Reverse String', 'Algorithms', 'Beginner', 'Write a function solve(input) that returns the reverse of input.', 'hello', 'olleh')
on conflict do nothing;
