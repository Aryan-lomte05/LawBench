-- 1. Alter comments table to support blog post comments (nullable resource_id, new blog_post_id)
alter table public.comments alter column resource_id drop not null;
alter table public.comments add column blog_post_id uuid references public.blog_posts on delete cascade;

-- Add check constraint to ensure comment belongs to either resource or blog post
alter table public.comments add constraint comment_target_check 
  check (
    (resource_id is not null and blog_post_id is null) or 
    (resource_id is null and blog_post_id is not null)
  );

-- 2. Create comment_votes table for tracking upvotes/downvotes
create table public.comment_votes (
  id uuid default uuid_generate_v4() primary key,
  comment_id uuid references public.comments on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  vote_type integer not null check (vote_type in (1, -1)), -- 1 for upvote, -1 for downvote
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (comment_id, user_id)
);

-- Enable RLS and add policies
alter table public.comment_votes enable row level security;

create policy "Comment votes are viewable by everyone." 
  on public.comment_votes for select using (true);

create policy "Authenticated users can cast a vote." 
  on public.comment_votes for insert with check (auth.uid() = user_id);

create policy "Users can update own vote." 
  on public.comment_votes for update using (auth.uid() = user_id);

create policy "Users can delete own vote." 
  on public.comment_votes for delete using (auth.uid() = user_id);
