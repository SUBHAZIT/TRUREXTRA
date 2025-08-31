-- Add a leaderboard table maintained by a trigger on submissions. RLS allows public reads, no writes.
create table if not exists leaderboard (
  user_id uuid primary key references auth.users(id) on delete cascade,
  solved_count int not null default 0,
  updated_at timestamptz not null default now()
);

alter table leaderboard enable row level security;

do $$ begin
  create policy "leaderboard_read_all" on leaderboard for select using (true);
exception when duplicate_object then null; end $$;

-- Function: increment user's solved_count when a passed submission is inserted
create or replace function fn_leaderboard_on_passed_submission()
returns trigger
language plpgsql
as $$
begin
  if NEW.passed = true then
    insert into leaderboard (user_id, solved_count, updated_at)
    values (NEW.user_id, 1, now())
    on conflict (user_id)
    do update set solved_count = leaderboard.solved_count + 1, updated_at = now();
  end if;
  return NEW;
end;
$$;

-- Trigger: after insert on submissions
do $$ begin
  create trigger trg_leaderboard_on_passed_submission
  after insert on submissions
  for each row execute function fn_leaderboard_on_passed_submission();
exception when duplicate_object then null; end $$;
