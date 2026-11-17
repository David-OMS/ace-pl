-- Demo tournament so you can click through admin end-to-end.
-- Run after players are seeded. Safe-ish to re-run: skips create if this name exists,
-- then always backfills tournament_players from current memberships.

do $$
declare
  tid uuid;
  team_a uuid;
  team_b uuid;
  team_c uuid;
  team_d uuid;
  team_e uuid;
  day1 uuid;
  day2 uuid;
  day3 uuid;
  day4 uuid;
  day5 uuid;
begin
  if exists (select 1 from public.tournaments where name = 'Ace Ballerz League 2026') then
    raise notice 'Tournament already exists — skipped create.';
  else
    insert into public.tournaments (
      name, status, starts_on, ends_on, players_on_pitch, squad_size, fantasy_budget,
      matches_per_game_day, first_place_tiebreak, keeper_mode
    ) values (
      'Ace Ballerz League 2026', 'setup', '2026-11-01', '2026-12-31', 6, 10, 68,
      4, 'discipline', 'shared'
    ) returning id into tid;

  insert into public.teams (tournament_id, name, color) values (tid, 'Team A', '#e63946') returning id into team_a;
  insert into public.teams (tournament_id, name, color) values (tid, 'Team B', '#1d70b8') returning id into team_b;
  insert into public.teams (tournament_id, name, color) values (tid, 'Team C', '#2a9d8f') returning id into team_c;
  insert into public.teams (tournament_id, name, color) values (tid, 'Team D', '#f4a100') returning id into team_d;
  insert into public.teams (tournament_id, name, color) values (tid, 'Team E', '#2b2d42') returning id into team_e;

    insert into public.game_days (tournament_id, played_on) values
      (tid, '2026-11-20') returning id into day1;
    insert into public.game_days (tournament_id, played_on) values
      (tid, '2026-11-27') returning id into day2;
    insert into public.game_days (tournament_id, played_on) values
      (tid, '2026-12-04') returning id into day3;
    insert into public.game_days (tournament_id, played_on) values
      (tid, '2026-12-11') returning id into day4;
    insert into public.game_days (tournament_id, played_on) values
      (tid, '2026-12-18') returning id into day5;

    -- Rough 9-player squads for testing (names from the seeded pool).
    insert into public.team_memberships (tournament_id, team_id, player_id, is_captain)
    select tid, team_a, p.id, p.name = 'Richie'
    from public.players p
    where p.name in ('Richie','Adams','Alisson','Ayo','Abbah','Wahab','Audu','Charles','Samin');

    insert into public.team_memberships (tournament_id, team_id, player_id, is_captain)
    select tid, team_b, p.id, p.name = 'Brymo'
    from public.players p
    where p.name in ('Brymo','Big 5','Buniyamin','Deo','Billy','Chisom','Ekene','Haaland','Logito');

    insert into public.team_memberships (tournament_id, team_id, player_id, is_captain)
    select tid, team_c, p.id, p.name = 'Daddy Ray'
    from public.players p
    where p.name in ('Daddy Ray','Fawaz','Tosin','Justin','Juwon','Dave','Ibrahim D','Kaka','Mikey');

    insert into public.team_memberships (tournament_id, team_id, player_id, is_captain)
    select tid, team_d, p.id, p.name = 'IBB'
    from public.players p
    where p.name in ('IBB','Ndibe','Prince','SK','Frank','Ibrahim G','Lamba','Pamzi','Emmy');

    insert into public.team_memberships (tournament_id, team_id, player_id, is_captain)
    select tid, team_e, p.id, false
    from public.players p
    where p.name in ('Pharooq','Ray','Shemshak','Sule','Victor','Japeth','Ladipo','Mitong','Tucha');

    insert into public.fixtures (
      tournament_id, game_day_id, home_team_id, away_team_id, kickoff_time, status
    ) values
      (tid, day1, team_b, team_c, '18:30', 'published'),
      (tid, day1, team_a, team_d, '18:57', 'published'),
      (tid, day1, team_e, team_c, '19:24', 'published'),
      (tid, day1, team_a, team_b, '19:51', 'published'),
      (tid, day2, team_d, team_e, '18:30', 'published'),
      (tid, day2, team_c, team_a, '18:57', 'published'),
      (tid, day2, team_d, team_b, '19:24', 'published'),
      (tid, day2, team_e, team_a, '19:51', 'published');

    raise notice 'Seeded Ace Ballerz League 2026 (id %)', tid;
  end if;
end $$;

-- Roster table was added after the first seed. Anyone already on a team is in the tournament.
insert into public.tournament_players (tournament_id, player_id)
select distinct m.tournament_id, m.player_id
from public.team_memberships m
where m.left_on is null
on conflict do nothing;

-- Backfill kit colours for teams created before the color column.
update public.teams set color = '#e63946' where name = 'Team A' and color = '#2b2d42';
update public.teams set color = '#1d70b8' where name = 'Team B';
update public.teams set color = '#2a9d8f' where name = 'Team C';
update public.teams set color = '#f4a100' where name = 'Team D';
update public.teams set color = '#2b2d42' where name = 'Team E';

-- Make sure your account is admin (edit email if needed).
-- update public.profiles set is_admin = true
-- where id = (select id from auth.users where email = 'YOUR_EMAIL');
