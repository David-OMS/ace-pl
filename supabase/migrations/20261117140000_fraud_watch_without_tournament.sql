-- Fraud Watch is a community list, not a tournament record.
-- Deleting a tournament must not wipe it.

alter table public.fraud_watch_entries
  drop constraint fraud_watch_entries_tournament_id_fkey;

alter table public.fraud_watch_entries
  alter column tournament_id drop not null;

alter table public.fraud_watch_entries
  add constraint fraud_watch_entries_tournament_id_fkey
  foreign key (tournament_id) references public.tournaments (id) on delete set null;
