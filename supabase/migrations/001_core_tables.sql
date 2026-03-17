-- Recruix.ai core tables
-- Run this in Supabase SQL editor

-- Resume metadata (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users primary key,
  full_name text,
  resume_url text,
  resume_filename text,
  resume_uploaded_at timestamptz,
  target_field text,
  experience_level text,
  skills text[],
  updated_at timestamptz default now()
);

-- Saved jobs
create table if not exists saved_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  job_id text not null,
  job_data jsonb not null,
  saved_at timestamptz default now()
);

-- Recently viewed jobs
create table if not exists job_views (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  job_id text not null,
  job_data jsonb not null,
  viewed_at timestamptz default now()
);

-- Applications
create table if not exists applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  job_id text not null,
  job_data jsonb not null,
  applied_at timestamptz default now(),
  status text default 'Submitted',
  auto_applied boolean default false
);

-- Auto apply settings
create table if not exists autoapply_settings (
  id uuid references auth.users primary key,
  enabled boolean default false,
  min_match integer default 85,
  job_types text[] default '{}',
  min_salary integer default 0,
  excluded_companies text[] default '{}',
  excluded_keywords text[] default '{}',
  updated_at timestamptz default now()
);

-- Resume match history
create table if not exists match_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  job_description text,
  score integer,
  results jsonb,
  analyzed_at timestamptz default now()
);

-- Saved searches
create table if not exists saved_searches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  query text,
  filters jsonb default '{}',
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table saved_jobs enable row level security;
alter table job_views enable row level security;
alter table applications enable row level security;
alter table autoapply_settings enable row level security;
alter table match_analyses enable row level security;
alter table saved_searches enable row level security;

-- RLS policies
drop policy if exists "Users own profiles" on profiles;
create policy "Users own profiles" on profiles for all using (auth.uid() = id);

drop policy if exists "Users own saved_jobs" on saved_jobs;
create policy "Users own saved_jobs" on saved_jobs for all using (auth.uid() = user_id);

drop policy if exists "Users own job_views" on job_views;
create policy "Users own job_views" on job_views for all using (auth.uid() = user_id);

drop policy if exists "Users own applications" on applications;
create policy "Users own applications" on applications for all using (auth.uid() = user_id);

drop policy if exists "Users own autoapply_settings" on autoapply_settings;
create policy "Users own autoapply_settings" on autoapply_settings for all using (auth.uid() = id);

drop policy if exists "Users own match_analyses" on match_analyses;
create policy "Users own match_analyses" on match_analyses for all using (auth.uid() = user_id);

drop policy if exists "Users own saved_searches" on saved_searches;
create policy "Users own saved_searches" on saved_searches for all using (auth.uid() = user_id);
