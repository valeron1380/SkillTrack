create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default 'Новый участник',
  role text not null default 'student' check (role in ('student', 'mentor')),
  direction text not null default 'Frontend',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(trim(title)) >= 2),
  category text not null,
  current_level int not null default 1 check (current_level between 1 and 10),
  target_level int not null default 6 check (target_level between 1 and 10),
  weekly_minutes_goal int not null default 180 check (weekly_minutes_goal between 30 and 2400),
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  review_status text not null default 'draft' check (review_status in ('draft', 'requested', 'reviewed')),
  mentor_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_goals (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(trim(title)) >= 2),
  due_date date,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.practice_logs (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  minutes int not null check (minutes between 5 and 720),
  note text not null check (char_length(trim(note)) >= 3),
  practiced_at date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists skills_owner_idx on public.skills(owner_id);
create index if not exists skill_goals_skill_idx on public.skill_goals(skill_id);
create index if not exists practice_logs_skill_idx on public.practice_logs(skill_id);
create index if not exists practice_logs_owner_date_idx on public.practice_logs(owner_id, practiced_at desc);

alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.skill_goals enable row level security;
alter table public.practice_logs enable row level security;

create or replace function public.current_user_is_mentor()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'mentor'
  );
$$;

drop policy if exists "profiles_select_own_or_mentor" on public.profiles;
create policy "profiles_select_own_or_mentor"
on public.profiles for select
using (id = auth.uid() or public.current_user_is_mentor());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "skills_select_own_or_mentor" on public.skills;
create policy "skills_select_own_or_mentor"
on public.skills for select
using (owner_id = auth.uid() or public.current_user_is_mentor());

drop policy if exists "skills_insert_own" on public.skills;
create policy "skills_insert_own"
on public.skills for insert
with check (owner_id = auth.uid());

drop policy if exists "skills_update_owner_or_mentor" on public.skills;
create policy "skills_update_owner_or_mentor"
on public.skills for update
using (owner_id = auth.uid() or public.current_user_is_mentor())
with check (owner_id = auth.uid() or public.current_user_is_mentor());

drop policy if exists "skills_delete_own" on public.skills;
create policy "skills_delete_own"
on public.skills for delete
using (owner_id = auth.uid());

drop policy if exists "goals_select_own_or_mentor" on public.skill_goals;
create policy "goals_select_own_or_mentor"
on public.skill_goals for select
using (owner_id = auth.uid() or public.current_user_is_mentor());

drop policy if exists "goals_insert_own" on public.skill_goals;
create policy "goals_insert_own"
on public.skill_goals for insert
with check (owner_id = auth.uid());

drop policy if exists "goals_update_own" on public.skill_goals;
create policy "goals_update_own"
on public.skill_goals for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "logs_select_own_or_mentor" on public.practice_logs;
create policy "logs_select_own_or_mentor"
on public.practice_logs for select
using (owner_id = auth.uid() or public.current_user_is_mentor());

drop policy if exists "logs_insert_own" on public.practice_logs;
create policy "logs_insert_own"
on public.practice_logs for insert
with check (owner_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, 'student'), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
