-- Create resumes storage bucket and policies for resume uploads
-- Run this in Supabase SQL editor
-- If the bucket already exists, you can skip the insert and just run the policies.

-- Create bucket (run in Supabase Dashboard > Storage > New bucket if this fails)
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do update set public = true;

-- Drop existing policies if re-running
drop policy if exists "Users can upload own resume" on storage.objects;
drop policy if exists "Users can update own resume" on storage.objects;
drop policy if exists "Users can select own resume" on storage.objects;
drop policy if exists "Users can delete own resume" on storage.objects;

-- Allow authenticated users to upload to their own folder: {user_id}/...
create policy "Users can upload own resume"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'resumes' and
  (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- Allow overwrite (upsert) - need select + update
create policy "Users can update own resume"
on storage.objects for update
to authenticated
using (
  bucket_id = 'resumes' and
  (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users can select own resume"
on storage.objects for select
to authenticated
using (
  bucket_id = 'resumes' and
  (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- Allow delete
create policy "Users can delete own resume"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'resumes' and
  (storage.foldername(name))[1] = (select auth.uid()::text)
);
