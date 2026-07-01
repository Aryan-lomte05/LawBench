-- 1. Add category column to blog_posts
alter table public.blog_posts add column category text;

-- 2. Create blog_post_votes table for upvotes/downvotes on articles
create table public.blog_post_votes (
  id uuid default uuid_generate_v4() primary key,
  blog_post_id uuid references public.blog_posts on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  vote_type integer not null check (vote_type in (1, -1)), -- 1 for upvote, -1 for downvote
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (blog_post_id, user_id)
);

-- Enable RLS and add policies
alter table public.blog_post_votes enable row level security;

create policy "Blog post votes are viewable by everyone." 
  on public.blog_post_votes for select using (true);

create policy "Authenticated users can cast a blog vote." 
  on public.blog_post_votes for insert with check (auth.uid() = user_id);

create policy "Users can update own blog vote." 
  on public.blog_post_votes for update using (auth.uid() = user_id);

create policy "Users can delete own blog vote." 
  on public.blog_post_votes for delete using (auth.uid() = user_id);
