-- Drop playtest budget from 72m to 68m.

alter table public.tournaments
  alter column fantasy_budget set default 68;

update public.tournaments
set fantasy_budget = 68
where fantasy_budget = 72;
