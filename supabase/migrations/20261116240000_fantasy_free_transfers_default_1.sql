-- v1 rule: 1 free transfer per GW (no carry). Old default was 2.
alter table public.fantasy_teams
  alter column free_transfers set default 1;

update public.fantasy_teams
set free_transfers = 1
where free_transfers = 2;
