-- Optional Recrux tables (see also existing profiles / saved_jobs in your project)
-- Run in Supabase SQL editor if you want jobs_saved, applications, skill_gaps, streaks.

create table if not exists public.jobs_saved (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  job_id text not null,
  job_data jsonb default '{}',
  match_score int,
  status text default 'saved',
  created_at timestamptz default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  job_id text not null,
  applied_at timestamptz default now(),
  status text default 'applied'
);

create table if not exists public.skill_gaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  skill text not null,
  frequency int default 1,
  created_at timestamptz default now()
);

create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  applied_count int default 0,
  unique (user_id, date)
);

alter table public.jobs_saved enable row level security;
alter table public.applications enable row level security;
alter table public.skill_gaps enable row level security;
alter table public.streaks enable row level security;

create policy "jobs_saved own" on public.jobs_saved for all using (auth.uid() = user_id);
create policy "applications own" on public.applications for all using (auth.uid() = user_id);
create policy "skill_gaps own" on public.skill_gaps for all using (auth.uid() = user_id);
create policy "streaks own" on public.streaks for all using (auth.uid() = user_id);
