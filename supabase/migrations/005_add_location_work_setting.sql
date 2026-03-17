-- Add preferred_location and work_setting for JSearch API filters
alter table profiles add column if not exists preferred_location text;
alter table profiles add column if not exists work_setting text;
