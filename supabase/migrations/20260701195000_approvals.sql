-- Add is_approved column to profiles table
alter table public.profiles add column is_approved boolean default false not null;

-- Update existing profiles (like seeded ones) to true initially so they aren't locked out
update public.profiles set is_approved = true where role = 'admin' or email = 'student@lawbench.com';

-- Add policy to allow admins to update any profile
create policy "Admins can update any profile" on public.profiles for update using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Add policy to allow admins to delete any profile
create policy "Admins can delete any profile" on public.profiles for delete using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);
