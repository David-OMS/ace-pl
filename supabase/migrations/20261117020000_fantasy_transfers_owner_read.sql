-- Transfer log is private to the manager (hits shouldn't be public gossip).
drop policy if exists "Fantasy transfers are public" on public.fantasy_transfers;

create policy "Owners read fantasy transfers"
on public.fantasy_transfers for select
to authenticated
using (
  exists (
    select 1 from public.fantasy_teams t
    where t.id = fantasy_transfers.team_id and t.user_id = auth.uid()
  )
);
