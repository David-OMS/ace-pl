-- Lets a claim link show the player name before anyone is signed in.
-- The token is the secret; the function returns only the name, and only while the link is unused.

create function public.preview_claim(claim_token uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.name
  from public.player_claim_tokens t
  join public.players p on p.id = t.player_id
  where t.token = claim_token
    and p.profile_id is null;
$$;

revoke execute on function public.preview_claim (uuid) from public;
grant execute on function public.preview_claim (uuid) to anon, authenticated;
