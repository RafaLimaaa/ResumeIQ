-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- Table: profiles
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  free_analyses_used integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Table: analyses
-- ============================================================
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  job_title text not null,
  company_name text,
  overall_score integer not null check (overall_score between 0 and 100),
  experience_score integer not null check (experience_score between 0 and 100),
  skills_score integer not null check (skills_score between 0 and 100),
  education_score integer not null check (education_score between 0 and 100),
  keywords_score integer not null check (keywords_score between 0 and 100),
  strengths text[] not null default '{}',
  gaps text[] not null default '{}',
  suggestions text[] not null default '{}',
  raw_result jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.analyses enable row level security;

-- Authenticated users see only their own analyses
create policy "analyses_select_own" on public.analyses
  for select using (auth.uid() = user_id);

-- Allow insert when authenticated (own) or anonymous (user_id is null)
create policy "analyses_insert_own" on public.analyses
  for insert with check (
    (auth.uid() is not null and auth.uid() = user_id)
    or
    (auth.uid() is null and user_id is null)
  );

create policy "analyses_update_own" on public.analyses
  for update using (auth.uid() = user_id);

create policy "analyses_delete_own" on public.analyses
  for delete using (auth.uid() = user_id);

-- ============================================================
-- Table: resume_files
-- ============================================================
create table if not exists public.resume_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  original_name text not null,
  created_at timestamptz not null default now()
);

alter table public.resume_files enable row level security;

create policy "resume_files_select_own" on public.resume_files
  for select using (auth.uid() = user_id);

create policy "resume_files_insert_own" on public.resume_files
  for insert with check (auth.uid() = user_id);

create policy "resume_files_update_own" on public.resume_files
  for update using (auth.uid() = user_id);

create policy "resume_files_delete_own" on public.resume_files
  for delete using (auth.uid() = user_id);
