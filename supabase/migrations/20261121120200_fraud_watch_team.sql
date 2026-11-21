-- Fraud Watch may flag a whole team (by team row) instead of a player.

alter table public.fraud_watch_entries
  alter column player_id drop not null;

alter table public.fraud_watch_entries
  add column team_id uuid references public.teams (id) on delete restrict;

alter table public.fraud_watch_entries
  drop constraint if exists fraud_watch_entries_subject_check;

alter table public.fraud_watch_entries
  add constraint fraud_watch_entries_subject_check
  check (
    (player_id is not null and team_id is null)
    or (player_id is null and team_id is not null)
  );

create index fraud_watch_entries_team_idx
  on public.fraud_watch_entries (team_id)
  where team_id is not null;
