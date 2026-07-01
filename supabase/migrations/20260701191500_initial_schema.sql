-- Enable necessary extensions
create extension if not exists "pg_trgm";
create extension if not exists "uuid-ossp";

-- Enum types
create type resource_type as enum ('note', 'bare_act', 'case_law', 'judgment', 'article', 'pyq', 'presentation', 'video');
create type user_role as enum ('user', 'admin');

-- PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role user_role default 'user'::user_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- SUBJECTS TABLE
create table public.subjects (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  description text,
  icon_name text,
  order_index integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subjects enable row level security;
create policy "Subjects are viewable by everyone." on public.subjects for select using (true);
create policy "Only admins can insert subjects." on public.subjects for insert with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Only admins can update subjects." on public.subjects for update using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Only admins can delete subjects." on public.subjects for delete using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- RESOURCES TABLE
create table public.resources (
  id uuid default uuid_generate_v4() primary key,
  subject_id uuid references public.subjects on delete cascade not null,
  semester text,
  unit text,
  title text not null,
  description text,
  type resource_type not null,
  file_url text,
  video_url text,
  author_or_uploader text,
  is_published boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  search_vector tsvector generated always as (setweight(to_tsvector('english', coalesce(title, '')), 'A') || setweight(to_tsvector('english', coalesce(description, '')), 'B')) stored
);

create index resources_search_idx on public.resources using gin(search_vector);

alter table public.resources enable row level security;
create policy "Published resources viewable by everyone." on public.resources for select using (is_published = true or exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Only admins can insert resources." on public.resources for insert with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Only admins can update resources." on public.resources for update using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Only admins can delete resources." on public.resources for delete using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- TAGS TABLE
create table public.tags (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tags enable row level security;
create policy "Tags viewable by everyone." on public.tags for select using (true);
create policy "Only admins can insert tags." on public.tags for insert with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- RESOURCE TAGS (many-to-many)
create table public.resource_tags (
  resource_id uuid references public.resources on delete cascade not null,
  tag_id uuid references public.tags on delete cascade not null,
  primary key (resource_id, tag_id)
);

alter table public.resource_tags enable row level security;
create policy "Resource tags viewable by everyone." on public.resource_tags for select using (true);
create policy "Only admins can modify resource tags." on public.resource_tags for all using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- BOOKMARKS TABLE
create table public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  resource_id uuid references public.resources on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, resource_id)
);

alter table public.bookmarks enable row level security;
create policy "Users can view own bookmarks." on public.bookmarks for select using (auth.uid() = user_id);
create policy "Users can insert own bookmarks." on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Users can delete own bookmarks." on public.bookmarks for delete using (auth.uid() = user_id);

-- PROGRESS TABLE (Video Resume Position)
create table public.progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  resource_id uuid references public.resources on delete cascade not null,
  position_seconds integer default 0 not null,
  completed boolean default false not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, resource_id)
);

alter table public.progress enable row level security;
create policy "Users can view own progress." on public.progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress." on public.progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress." on public.progress for update using (auth.uid() = user_id);

-- COMMENTS TABLE
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  resource_id uuid references public.resources on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  parent_id uuid references public.comments on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;
create policy "Comments viewable by everyone." on public.comments for select using (true);
create policy "Authenticated users can insert comments." on public.comments for insert with check (auth.role() = 'authenticated');
create policy "Users can update own comments." on public.comments for update using (auth.uid() = user_id);
create policy "Users can delete own comments or admins." on public.comments for delete using (auth.uid() = user_id or exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- BLOG POSTS TABLE
create table public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  body text,
  cover_image_url text,
  author_id uuid references public.profiles on delete set null,
  is_published boolean default false not null,
  comments_enabled boolean default true not null,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.blog_posts enable row level security;
create policy "Published posts viewable by everyone." on public.blog_posts for select using (is_published = true or exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Only admins can modify blog posts." on public.blog_posts for all using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- CONTACT MESSAGES TABLE
create table public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contact_messages enable row level security;
create policy "Anyone can insert contact messages." on public.contact_messages for insert with check (true);
create policy "Only admins can view contact messages." on public.contact_messages for select using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- Triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at before update on public.profiles for each row execute procedure public.handle_updated_at();
create trigger set_subjects_updated_at before update on public.subjects for each row execute procedure public.handle_updated_at();
create trigger set_resources_updated_at before update on public.resources for each row execute procedure public.handle_updated_at();
create trigger set_progress_updated_at before update on public.progress for each row execute procedure public.handle_updated_at();
create trigger set_comments_updated_at before update on public.comments for each row execute procedure public.handle_updated_at();
create trigger set_blog_posts_updated_at before update on public.blog_posts for each row execute procedure public.handle_updated_at();

-- Trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
