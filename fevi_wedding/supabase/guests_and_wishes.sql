-- Fevi & Abenezer: guest invitations, wishes, roles, and gate check-in.
-- Run this entire file once in the Supabase SQL Editor.
--
-- After creating the two Auth users (admin and gate), assign their roles with:
-- update public.staff_roles set role = 'admin' where user_id = '<admin-user-uuid>';
-- update public.staff_roles set role = 'gate' where user_id = '<gate-user-uuid>';

begin;

create extension if not exists pgcrypto;

create table if not exists public.staff_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'gate')),
  created_at timestamptz not null default now()
);

create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.staff_roles where user_id = auth.uid();
$$;

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  guest_limit integer not null check (guest_limit between 1 and 3),
  invitation_token text not null unique,
  announcement_type text not null check (announcement_type in ('bride', 'groom')),
  guests_checked_in integer not null default 0 check (guests_checked_in >= 0 and guests_checked_in <= guest_limit),
  checked_in boolean not null default false,
  checked_in_at timestamptz,
  created_at timestamptz not null default now()
);

-- Preserve a previous deployment that used the old `invitations` table.
do $$
begin
  if to_regclass('public.invitations') is not null then
    insert into public.guests (
      id, name, guest_limit, invitation_token, announcement_type,
      guests_checked_in, checked_in, checked_in_at, created_at
    )
    select id, name, guest_limit, invitation_token, announcement_type,
      guests_checked_in, checked_in, checked_in_at, created_at
    from public.invitations
    on conflict (invitation_token) do nothing;
  end if;
end;
$$;

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid references public.guests(id) on delete cascade,
  author_name text not null check (char_length(trim(author_name)) between 1 and 80),
  wish_message text not null check (char_length(trim(wish_message)) between 1 and 500),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

-- Upgrade older wish schemas. The earliest version used `message` and did not
-- store an author, so preserve its text and use the invitation guest name.
alter table public.wishes add column if not exists guest_id uuid;
alter table public.wishes add column if not exists author_name text;
alter table public.wishes add column if not exists wish_message text;
alter table public.wishes add column if not exists status text not null default 'pending';
alter table public.wishes add column if not exists created_at timestamptz not null default now();
alter table public.wishes add column if not exists reviewed_at timestamptz;
alter table public.wishes add column if not exists reviewed_by uuid references auth.users(id);
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'wishes'
               and column_name = 'message') then
    update public.wishes
    set wish_message = message
    where wish_message is null;
  end if;

  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'wishes'
               and column_name = 'invitation_token') then
    update public.wishes w
    set guest_id = g.id
    from public.guests g
    where w.guest_id is null and w.invitation_token = g.invitation_token;
  end if;

  -- Some older deployments stored wishes against an `invitations.id` value.
  -- Translate those IDs to the matching new guest before applying the FK.
  if to_regclass('public.invitations') is not null then
    update public.wishes w
    set guest_id = g.id
    from public.invitations i
    join public.guests g on g.invitation_token = i.invitation_token
    where w.guest_id = i.id
      and not exists (select 1 from public.guests current_guest where current_guest.id = w.guest_id);
  end if;

  -- Test/legacy wishes without a valid guest cannot be moderated safely.
  -- Remove them before enforcing the new relationship.
  delete from public.wishes w
  where w.guest_id is null
    or not exists (select 1 from public.guests g where g.id = w.guest_id)
    or w.wish_message is null
    or char_length(trim(w.wish_message)) = 0;

  update public.wishes w
  set author_name = coalesce(nullif(trim(w.author_name), ''), g.name, 'Guest')
  from public.guests g
  where g.id = w.guest_id
    and (w.author_name is null or trim(w.author_name) = '');

  alter table public.wishes alter column guest_id set not null;
  alter table public.wishes alter column author_name set not null;
  alter table public.wishes alter column wish_message set not null;

  if not exists (select 1 from pg_constraint
                 where conname = 'wishes_guest_id_fkey'
                   and conrelid = 'public.wishes'::regclass) then
    alter table public.wishes
      add constraint wishes_guest_id_fkey
      foreign key (guest_id) references public.guests(id) on delete cascade;
  end if;
end;
$$;

-- These fields belonged to older wishes schemas. They are not used by the
-- current RPCs and, when marked NOT NULL, prevent new wish submissions.
alter table public.wishes drop column if exists message;
alter table public.wishes drop column if exists invitation_token;
alter table public.wishes drop column if exists guest_name;

create index if not exists wishes_status_created_at_idx on public.wishes(status, created_at desc);
create index if not exists wishes_guest_id_idx on public.wishes(guest_id);

alter table public.staff_roles enable row level security;
alter table public.guests enable row level security;
alter table public.wishes enable row level security;

-- Tables remain private. The following RPCs are the only browser API.
-- The old project may have defined this function with another return type;
-- PostgreSQL requires it to be dropped before its return signature changes.
drop function if exists public.get_checkin_status(text);
drop function if exists public.get_approved_wishes();
drop function if exists public.get_pending_wishes();

create or replace function public.create_guests(guest_rows jsonb)
returns table (id uuid, name text, guest_limit integer, invitation_token text, announcement_type text)
language plpgsql security definer set search_path = public, extensions
as $$
declare row_value jsonb; guest_name text; limit_value integer; announcement_value text;
begin
  if public.get_my_role() <> 'admin' then raise exception 'Unauthorized'; end if;
  if jsonb_typeof(guest_rows) <> 'array' or jsonb_array_length(guest_rows) = 0 then
    raise exception 'At least one guest is required.';
  end if;
  for row_value in select value from jsonb_array_elements(guest_rows) loop
    guest_name := nullif(trim(row_value ->> 'name'), '');
    limit_value := nullif(trim(row_value ->> 'guest_limit'), '')::integer;
    announcement_value := nullif(trim(row_value ->> 'announcement_type'), '');
    if guest_name is null then raise exception 'Every guest needs a name.'; end if;
    if limit_value not between 1 and 3 then raise exception 'Guest limit for % must be 1, 2, or 3.', guest_name; end if;
    if announcement_value not in ('bride', 'groom') then raise exception 'Announcement type must be bride or groom.'; end if;
    return query insert into public.guests as new_guest (name, guest_limit, invitation_token, announcement_type)
      values (guest_name, limit_value, encode(gen_random_bytes(16), 'hex'), announcement_value)
      returning new_guest.id, new_guest.name, new_guest.guest_limit, new_guest.invitation_token, new_guest.announcement_type;
  end loop;
end;
$$;

create or replace function public.get_guest_by_token(token_value text)
returns table (name text, guest_limit integer, announcement_type text)
language sql stable security definer set search_path = public
as $$ select name, guest_limit, announcement_type from public.guests
       where invitation_token = trim(token_value) limit 1; $$;

create or replace function public.get_checkin_status(token_value text)
returns table (guests_checked_in integer)
language plpgsql stable security definer set search_path = public
as $$
begin
  if public.get_my_role() not in ('admin', 'gate') then raise exception 'Unauthorized'; end if;
  return query select g.guests_checked_in from public.guests g where g.invitation_token = trim(token_value);
end;
$$;

create or replace function public.check_in_guest(token_value text, arriving_guests integer)
returns table (success boolean, message text, guest_name text, guest_limit integer, already_checked_in integer, arriving integer, remaining integer)
language plpgsql security definer set search_path = public
as $$
declare guest_record public.guests%rowtype; prior_count integer;
begin
  if public.get_my_role() not in ('admin', 'gate') then raise exception 'Unauthorized'; end if;
  select * into guest_record from public.guests where invitation_token = trim(token_value) for update;
  if not found then return query select false, 'Invalid invitation.', null::text, null::integer, 0, coalesce(arriving_guests, 0), 0; return; end if;
  prior_count := guest_record.guests_checked_in;
  if arriving_guests is null or arriving_guests < 1 then
    return query select false, 'At least one guest must arrive.', guest_record.name, guest_record.guest_limit, prior_count, coalesce(arriving_guests, 0), guest_record.guest_limit - prior_count; return;
  end if;
  if prior_count + arriving_guests > guest_record.guest_limit then
    return query select false, 'This would exceed the guest allowance.', guest_record.name, guest_record.guest_limit, prior_count, arriving_guests, guest_record.guest_limit - prior_count; return;
  end if;
  update public.guests set guests_checked_in = prior_count + arriving_guests, checked_in = true, checked_in_at = now()
    where id = guest_record.id;
  return query select true, 'Guest checked in.', guest_record.name, guest_record.guest_limit, prior_count, arriving_guests, guest_record.guest_limit - prior_count - arriving_guests;
end;
$$;

create or replace function public.submit_wish(token_value text, wish_message text, author_name text)
returns table (success boolean, message text)
language plpgsql security definer set search_path = public
as $$
declare guest_uuid uuid; clean_message text := trim(wish_message); clean_author text := trim(author_name);
begin
  if clean_message is null or char_length(clean_message) not between 1 and 500 then return query select false, 'Wish messages must contain 1 to 500 characters.'; return; end if;
  if clean_author is null or char_length(clean_author) not between 1 and 80 then return query select false, 'Names must contain 1 to 80 characters.'; return; end if;
  select id into guest_uuid from public.guests where invitation_token = trim(token_value);
  if guest_uuid is null then return query select false, 'This invitation could not be found.'; return; end if;
  insert into public.wishes (guest_id, author_name, wish_message) values (guest_uuid, clean_author, clean_message);
  return query select true, 'Thank you! Your wish has been sent for review.';
end;
$$;

create or replace function public.get_approved_wishes()
returns table (id uuid, author_name text, wish_message text, created_at timestamptz)
language sql stable security definer set search_path = public
as $$ select id, author_name, wish_message, created_at from public.wishes where status = 'approved' order by created_at desc; $$;

create or replace function public.get_pending_wishes()
returns table (id uuid, author_name text, wish_message text, guest_name text, invitation_token text, status text, created_at timestamptz)
language plpgsql stable security definer set search_path = public
as $$
begin
  if public.get_my_role() <> 'admin' then raise exception 'Unauthorized'; end if;
  return query select w.id, w.author_name, w.wish_message, g.name, g.invitation_token, w.status, w.created_at
    from public.wishes w left join public.guests g on g.id = w.guest_id
    where w.status = 'pending' order by w.created_at asc;
end;
$$;

create or replace function public.review_wish(wish_id uuid, next_status text)
returns table (success boolean, message text)
language plpgsql security definer set search_path = public
as $$
begin
  if public.get_my_role() <> 'admin' then return query select false, 'Unauthorized'; return; end if;
  if next_status not in ('approved', 'rejected') then return query select false, 'Invalid review status.'; return; end if;
  update public.wishes set status = next_status, reviewed_at = now(), reviewed_by = auth.uid() where id = wish_id and status = 'pending';
  if not found then return query select false, 'Wish not found or already reviewed.'; return; end if;
  return query select true, case when next_status = 'approved' then 'Wish approved.' else 'Wish rejected.' end;
end;
$$;

revoke all on all tables in schema public from anon, authenticated;
revoke all on function public.create_guests(jsonb), public.get_guest_by_token(text), public.get_checkin_status(text), public.check_in_guest(text, integer), public.submit_wish(text, text, text), public.get_approved_wishes(), public.get_pending_wishes(), public.review_wish(uuid, text) from public;

-- Disable the old RPC surface if this project previously used `invitations`.
do $$
begin
  if to_regprocedure('public.create_invitations(jsonb)') is not null then
    execute 'revoke all on function public.create_invitations(jsonb) from public';
  end if;
  if to_regprocedure('public.get_invitation_by_token(text)') is not null then
    execute 'revoke all on function public.get_invitation_by_token(text) from public';
  end if;
  if to_regprocedure('public.check_in_invitation(text,integer)') is not null then
    execute 'revoke all on function public.check_in_invitation(text, integer) from public';
  end if;
end;
$$;
grant execute on function public.get_my_role() to authenticated;
grant execute on function public.create_guests(jsonb), public.get_checkin_status(text), public.check_in_guest(text, integer), public.get_pending_wishes(), public.review_wish(uuid, text) to authenticated;
grant execute on function public.get_guest_by_token(text), public.submit_wish(text, text, text), public.get_approved_wishes() to anon, authenticated;

notify pgrst, 'reload schema';
commit;
