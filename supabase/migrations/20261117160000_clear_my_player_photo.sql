create function public.clear_my_player_photo()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.players p
  set photo_path = null
  where p.profile_id = (select auth.uid());

  if not found then
    raise exception 'no_linked_player';
  end if;
end;
$$;

revoke execute on function public.clear_my_player_photo() from public, anon;
grant execute on function public.clear_my_player_photo() to authenticated;
