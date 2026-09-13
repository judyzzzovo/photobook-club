-- Run this once in Supabase SQL Editor to make Monthly picks shared for every visitor.
create table if not exists public.monthly_picks (
  slot smallint primary key check (slot between 0 and 3),
  image_url text not null,
  author text not null,
  updated_at timestamptz not null default now()
);

alter table public.monthly_picks enable row level security;

drop policy if exists "Public can read monthly picks" on public.monthly_picks;
drop policy if exists "Editor can manage monthly picks" on public.monthly_picks;

create policy "Public can read monthly picks"
on public.monthly_picks for select to anon, authenticated
using (true);

create policy "Editor can manage monthly picks"
on public.monthly_picks for all to authenticated
using ((auth.jwt() ->> 'email') = 'judyqianqianovo@gmail.com')
with check ((auth.jwt() ->> 'email') = 'judyqianqianovo@gmail.com');
