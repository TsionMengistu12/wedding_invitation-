-- Run this once in Supabase SQL Editor if sending a new wish fails after the
-- guests_and_wishes.sql migration has already been deployed.
-- Removes unused columns from the old wishes schema that can still be NOT NULL.

begin;

alter table public.wishes drop column if exists message;
alter table public.wishes drop column if exists invitation_token;
alter table public.wishes drop column if exists guest_name;

notify pgrst, 'reload schema';
commit;
