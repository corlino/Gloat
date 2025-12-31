-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Public profiles for users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  display_name text,
  bio text,
  is_private boolean default false,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(username) >= 3)
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- GOALS
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  category text, -- 'health', 'career', 'creative', 'learning', 'other'
  timeframe text check (timeframe in ('monthly', 'yearly')),
  start_date date,
  end_date date,
  privacy text check (privacy in ('public', 'followers', 'private')) default 'public',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.goals enable row level security;

-- Goal Policies
-- Public goals are viewable by everyone
create policy "Public goals are viewable by everyone"
  on public.goals for select
  using (privacy = 'public');

-- Private goals are viewable by owner
create policy "Users can view their own goals"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Users can create goals"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own goals"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own goals"
  on public.goals for delete
  using (auth.uid() = user_id);

-- GOAL UPDATES
create table public.goal_updates (
  id uuid default uuid_generate_v4() primary key,
  goal_id uuid references public.goals(id) on delete cascade not null,
  progress_text text,
  numeric_value float,
  target_value float,
  reflection text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.goal_updates enable row level security;

create policy "Owners can create updates"
  on public.goal_updates for insert
  with check (
    exists (
      select 1 from public.goals
      where public.goals.id = public.goal_updates.goal_id
      and public.goals.user_id = auth.uid()
    )
  );

-- FOLLOWS
create table public.follows (
  id uuid default uuid_generate_v4() primary key,
  follower_id uuid references public.profiles(id) not null,
  following_id uuid references public.profiles(id) not null,
  status text check (status in ('pending', 'accepted')) default 'accepted', -- simplified for MVP
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(follower_id, following_id)
);

alter table public.follows enable row level security;

create policy "Follows viewable by everyone"
  on public.follows for select
  using (true);

create policy "Users can follow others"
  on public.follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on public.follows for delete
  using (auth.uid() = follower_id);

-- Add missing Followers policy for Goals
create policy "Followers can view goals"
  on public.goals for select
  using (
    privacy = 'followers'
    and exists (
      select 1 from public.follows
      where follower_id = auth.uid()
      and following_id = public.goals.user_id
    )
  );

-- UPDATE POLICIES FOR GOAL_UPDATES (Dependencies)
create policy "Goal updates viewable if goal is viewable"
  on public.goal_updates for select
  using (
    exists (
      select 1 from public.goals
      where public.goals.id = public.goal_updates.goal_id
      and (
        public.goals.privacy = 'public'
        or public.goals.user_id = auth.uid()
        or (
          public.goals.privacy = 'followers'
          and exists (
            select 1 from public.follows
            where follower_id = auth.uid()
            and following_id = public.goals.user_id
          )
        )
      )
    )
  );

-- REACTIONS
create table public.reactions (
  id uuid default uuid_generate_v4() primary key,
  update_id uuid references public.goal_updates(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  type text check (type in ('cheering', 'got_this', 'love_it')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(update_id, user_id)
);

alter table public.reactions enable row level security;

create policy "Reactions viewable by everyone"
  on public.reactions for select
  using (true);

create policy "Users can react"
  on public.reactions for insert
  with check (auth.uid() = user_id);
  
create policy "Users can remove reaction"
  on public.reactions for delete
  using (auth.uid() = user_id);

-- Setup trigger to create profile on signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
