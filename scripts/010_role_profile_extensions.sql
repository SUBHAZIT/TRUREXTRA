DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    RAISE EXCEPTION 'profiles table missing';
  END IF;
END$$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text check (role in ('student','mentor','recruiter','organizer','investor','institute'));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS institute text,
  ADD COLUMN IF NOT EXISTS degree text,
  ADD COLUMN IF NOT EXISTS grad_year text,
  ADD COLUMN IF NOT EXISTS headline text,
  ADD COLUMN IF NOT EXISTS experience_years text,
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS position text,
  ADD COLUMN IF NOT EXISTS org_name text,
  ADD COLUMN IF NOT EXISTS org_type text,
  ADD COLUMN IF NOT EXISTS firm text,
  ADD COLUMN IF NOT EXISTS focus text,
  ADD COLUMN IF NOT EXISTS institute_name text,
  ADD COLUMN IF NOT EXISTS domain text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='profiles_self_select') THEN
    CREATE POLICY profiles_self_select ON public.profiles FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='profiles_self_upsert') THEN
    CREATE POLICY profiles_self_upsert ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='profiles_self_update') THEN
    CREATE POLICY profiles_self_update ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END$$;
