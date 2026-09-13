-- Run this file once in Supabase: SQL Editor → New query → Run.

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  author text not null check (char_length(author) between 1 and 120),
  email text not null check (char_length(email) between 3 and 255),
  category text not null check (category in ('city', 'people', 'landscape', 'sport', 'culture', 'other')),
  media_type text not null check (media_type in ('image', 'video')),
  object_path text not null unique,
  note text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.submissions enable row level security;

create policy "Public can submit pending work"
on public.submissions for insert to anon, authenticated
with check (status = 'pending');

create policy "Public can view approved work"
on public.submissions for select to anon, authenticated
using (status = 'approved');

create policy "Editor can manage all submissions"
on public.submissions for all to authenticated
using ((auth.jwt() ->> 'email') = 'judyqianqianovo@gmail.com')
with check ((auth.jwt() ->> 'email') = 'judyqianqianovo@gmail.com');

create table public.monthly_picks (
  slot smallint primary key check (slot between 0 and 3),
  image_url text not null,
  author text not null,
  updated_at timestamptz not null default now()
);

alter table public.monthly_picks enable row level security;

create policy "Public can read monthly picks"
on public.monthly_picks for select to anon, authenticated
using (true);

create policy "Editor can manage monthly picks"
on public.monthly_picks for all to authenticated
using ((auth.jwt() ->> 'email') = 'judyqianqianovo@gmail.com')
with check ((auth.jwt() ->> 'email') = 'judyqianqianovo@gmail.com');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'submissions',
  'submissions',
  true,
  20971520,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do nothing;

-- Run this too if the bucket was created previously with a smaller limit.
update storage.buckets set file_size_limit = 20971520 where id = 'submissions';

create policy "Public can upload submission files"
on storage.objects for insert to anon, authenticated
with check (bucket_id = 'submissions');

create policy "Public can read submission files"
on storage.objects for select to anon, authenticated
using (bucket_id = 'submissions');

create policy "Editor can delete submission files"
on storage.objects for delete to authenticated
using (
  bucket_id = 'submissions'
  and (auth.jwt() ->> 'email') = 'judyqianqianovo@gmail.com'
);
