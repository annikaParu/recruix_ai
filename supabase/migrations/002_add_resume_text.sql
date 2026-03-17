-- Add resume_text to profiles for Resume Match feature
alter table profiles add column if not exists resume_text text;
