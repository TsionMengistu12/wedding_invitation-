-- Repairs only the gate admission RPC. It does not alter guest records,
-- invitations, roles, or any other application data.
begin;

-- Keep existing guest rows and invitation tokens unchanged while upgrading
-- older deployments that do not yet have the check-in timestamp column.
alter table public.guests
  add column if not exists checked_in_at timestamptz;

drop function if exists public.check_in_guest(text, integer);

create function public.check_in_guest(token_value text, arriving_guests integer)
returns table (
  success boolean,
  message text,
  guest_name text,
  guest_limit integer,
  already_checked_in integer,
  arriving integer,
  remaining integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  guest_record public.guests%rowtype;
  prior_count integer;
begin
  if public.get_my_role() not in ('admin', 'gate') then
    raise exception 'Unauthorized';
  end if;

  select * into guest_record
  from public.guests
  where invitation_token = trim(token_value)
  for update;

  if not found then
    return query select false, 'Invalid invitation.', null::text, null::integer,
      0, coalesce(arriving_guests, 0), 0;
    return;
  end if;

  prior_count := guest_record.guests_checked_in;

  if arriving_guests is null or arriving_guests < 1 then
    return query select false, 'At least one guest must arrive.', guest_record.name,
      guest_record.guest_limit, prior_count, coalesce(arriving_guests, 0),
      guest_record.guest_limit - prior_count;
    return;
  end if;

  if prior_count + arriving_guests > guest_record.guest_limit then
    return query select false, 'This would exceed the guest allowance.', guest_record.name,
      guest_record.guest_limit, prior_count, arriving_guests,
      guest_record.guest_limit - prior_count;
    return;
  end if;

  update public.guests
  set guests_checked_in = prior_count + arriving_guests,
      checked_in = true,
      checked_in_at = now()
  where id = guest_record.id;

  return query select true, 'Guest checked in.', guest_record.name,
    guest_record.guest_limit, prior_count, arriving_guests,
    guest_record.guest_limit - prior_count - arriving_guests;
end;
$$;

revoke all on function public.check_in_guest(text, integer) from public;
grant execute on function public.check_in_guest(text, integer) to authenticated;

notify pgrst, 'reload schema';
commit;
