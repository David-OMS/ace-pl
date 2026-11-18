-- Fantasy team names are unique per tournament; owners may rename a limited number of times.

alter table public.fantasy_teams
  add column name_change_count smallint not null default 0
  constraint fantasy_teams_name_change_count_check
  check (name_change_count >= 0 and name_change_count <= 2);

create unique index fantasy_teams_tournament_name_uidx
  on public.fantasy_teams (tournament_id, lower(trim(name)));
