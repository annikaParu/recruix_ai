-- Add preferred job categories (user can select multiple: Software, AI, Business, etc.)
alter table profiles add column if not exists preferred_categories text[] default '{}';
