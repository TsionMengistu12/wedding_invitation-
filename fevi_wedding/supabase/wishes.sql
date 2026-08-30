-- Wedding wishes: submission, moderation, and public display.
-- Run this in the Supabase SQL editor for your project.

create extension if not exists pgcrypto;

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  invitation_token text not null,
  guest_name text,
  author_name text not null,
  wish_message text not null check (char_length(trim(wish_message)) > 0),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id)
);

create index if not exists wishes_status_created_at_idx
  on public.wishes (status, created_at desc);

create index if not exists wishes_invitation_token_idx
  on public.wishes (invitation_token);

alter table public.wishes enable row level security;

-- Replace submit_wish so guests can send wishes from their invitation link.
create or replace function public.submit_wish(
  token_value text,
  wish_message text,
  author_name text default null
)
returns table (success boolean, message text)
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_token text := trim(token_value);
  normalized_message text := trim(wish_message);
  normalized_author text := trim(coalesce(author_name, ''));
  linked_guest_name text;
begin
  if normalized_token = '' then
    return query select false, 'Invalid invitation.';
    return;
  end if;

  if normalized_message = '' then
    return query select false, 'Please write a message first.';
    return;
  end if;

  if char_length(normalized_message) > 500 then
    return query select false, 'Your wish is too long.';
    return;
  end if;

  if normalized_author = '' then
    return query select false, 'Please enter your name.';
    return;
  end if;

  if char_length(normalized_author) > 80 then
    return query select false, 'Your name is too long.';
    return;
  end if;

  select i.name
  into linked_guest_name
  from public.invitations i
  where i.invitation_token = normalized_token
  limit 1;

  if linked_guest_name is null then
    return query select false, 'This invitation could not be found.';
    return;
  end if;

  insert into public.wishes (
    invitation_token,
    guest_name,
    author_name,
    wish_message,
    status
  )
  values (
    normalized_token,
    linked_guest_name,
    normalized_author,
    normalized_message,
    'pending'
  );

  return query
    select true,
      'Thank you! Your wish has been sent for review.'::text;
end;
$$;

create or replace function public.get_approved_wishes()
returns table (
  id uuid,
  author_name text,
  wish_message text,
  created_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select
    w.id,
    w.author_name,
    w.wish_message,
    w.created_at
  from public.wishes w
  where w.status = 'approved'
  order by w.created_at desc;
$$;

create or replace function public.get_pending_wishes()
returns table (
  id uuid,
  author_name text,
  wish_message text,
  guest_name text,
  invitation_token text,
  status text,
  created_at timestamptz
)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if coalesce(public.get_my_role(), '') <> 'admin' then
    raise exception 'Unauthorized';
  end if;

  return query
    select
      w.id,
      w.author_name,
      w.wish_message,
      w.guest_name,
      w.invitation_token,
      w.status,
      w.created_at
    from public.wishes w
    where w.status = 'pending'
    order by w.created_at asc;
end;
$$;

create or replace function public.approve_wish(wish_id uuid)
returns table (success boolean, message text)
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(public.get_my_role(), '') <> 'admin' then
    return query select false, 'Unauthorized'::text;
    return;
  end if;

  update public.wishes w
  set
    status = 'approved',
    reviewed_at = now(),
    reviewed_by = auth.uid()
  where w.id = wish_id
    and w.status = 'pending';

  if not found then
    return query select false, 'Wish not found or already reviewed.'::text;
    return;
  end if;

  return query select true, 'Wish approved.'::text;
end;
$$;

create or replace function public.reject_wish(wish_id uuid)
returns table (success boolean, message text)
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(public.get_my_role(), '') <> 'admin' then
    return query select false, 'Unauthorized'::text;
    return;
  end if;

  update public.wishes w
  set
    status = 'rejected',
    reviewed_at = now(),
    reviewed_by = auth.uid()
  where w.id = wish_id
    and w.status = 'pending';

  if not found then
    return query select false, 'Wish not found or already reviewed.'::text;
    return;
  end if;

  return query select true, 'Wish rejected.'::text;
end;
$$;

grant execute on function public.submit_wish(text, text, text) to anon, authenticated;
grant execute on function public.get_approved_wishes() to anon, authenticated;
grant execute on function public.get_pending_wishes() to authenticated;
grant execute on function public.approve_wish(uuid) to authenticated;
grant execute on function public.reject_wish(uuid) to authenticated;

-- Make newly created RPCs available to the REST API immediately.
notify pgrst, 'reload schema';
