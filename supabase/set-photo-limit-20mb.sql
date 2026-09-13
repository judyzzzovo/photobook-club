-- Run this once in Supabase SQL Editor if your `submissions` bucket already exists.
update storage.buckets
set file_size_limit = 20971520
where id = 'submissions';
