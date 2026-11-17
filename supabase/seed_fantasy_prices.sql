-- Opening fantasy prices + budget for Ace Ballerz League 2026.
-- Run after seed_players.sql and seed_tournament.sql (and the fantasy_budget migration).
-- Safe to re-run: upserts ranks, sets budget, adds missing roster rows.

do $$
declare
  tid uuid;
begin
  select id into tid
  from public.tournaments
  where name = 'Ace Ballerz League 2026'
  order by created_at desc
  limit 1;

  if tid is null then
    raise notice 'No Ace Ballerz League 2026 tournament — skipped fantasy seed.';
    return;
  end if;

  update public.tournaments
  set fantasy_budget = 68
  where id = tid;

  -- Roster every priced player so they are pickable.
  insert into public.tournament_players (tournament_id, player_id)
  select tid, p.id
  from public.players p
  where p.name in (
    'Logito', 'Samin',
    'Justin', 'Bobby', 'Fawaz', 'Big 5', 'Mikey', 'Tosin', 'Elite', 'Deo',
    'Daddy Ray', 'Ayo', 'Buniyamin', 'Richie', 'Adams', 'Alisson', 'Ndibe',
    'Prince', 'SK', 'Kanye', 'Korede',
    'Billy', 'Chisom', 'Frank', 'Abbah', 'Emmy', 'Tosan', 'Tobi', 'Tucha',
    'Ibrahim G', 'Ladipo', 'Mitong', 'Ricky', 'Mike', 'Wahab', 'IBB', 'Juwon',
    'Kylez',
    'Ekene', 'Pharooq', 'Audu', 'Ray', 'Brymo', 'Charles', 'Ibrahim D',
    'Swanky', 'Haaland', 'Japeth', 'Jamal', 'Čalēb', 'Sule', 'Kaka', 'Pamzi',
    'Victor', 'Lamba', 'Shemshak', 'Ocheni'
  )
  on conflict do nothing;

  insert into public.fantasy_player_ranks (tournament_id, player_id, rank, price)
  select
    tid,
    p.id,
    case
      when v.price >= 12 then 'S'::public.fantasy_rank
      when v.price >= 8 then 'A'::public.fantasy_rank
      when v.price >= 6 then 'B'::public.fantasy_rank
      else 'C'::public.fantasy_rank
    end,
    v.price
  from (
    values
      ('Logito', 5.0),
      ('Samin', 5.0),
      ('Justin', 7.5),
      ('Bobby', 8.0),
      ('Fawaz', 8.0),
      ('Big 5', 7.5),
      ('Mikey', 7.5),
      ('Tosin', 6.5),
      ('Elite', 6.5),
      ('Deo', 6.0),
      ('Daddy Ray', 5.5),
      ('Ayo', 5.5),
      ('Buniyamin', 5.5),
      ('Richie', 5.0),
      ('Adams', 5.0),
      ('Alisson', 5.0),
      ('Ndibe', 5.0),
      ('Prince', 5.0),
      ('SK', 5.0),
      ('Kanye', 5.0),
      ('Korede', 5.0),
      ('Billy', 12.5),
      ('Chisom', 8.5),
      ('Frank', 8.5),
      ('Abbah', 8.0),
      ('Emmy', 7.0),
      ('Tosan', 7.0),
      ('Tobi', 6.5),
      ('Tucha', 6.5),
      ('Ibrahim G', 6.0),
      ('Ladipo', 6.0),
      ('Mitong', 6.0),
      ('Ricky', 6.0),
      ('Mike', 6.0),
      ('Wahab', 5.5),
      ('IBB', 5.0),
      ('Juwon', 5.0),
      ('Kylez', 5.0),
      ('Ekene', 15.5),
      ('Pharooq', 14.5),
      ('Audu', 10.0),
      ('Ray', 10.0),
      ('Brymo', 9.5),
      ('Charles', 9.5),
      ('Ibrahim D', 9.5),
      ('Swanky', 9.0),
      ('Haaland', 7.0),
      ('Japeth', 7.0),
      ('Jamal', 7.0),
      ('Čalēb', 7.0),
      ('Sule', 6.5),
      ('Kaka', 5.5),
      ('Pamzi', 5.5),
      ('Victor', 5.5),
      ('Lamba', 5.0),
      ('Shemshak', 5.0),
      ('Ocheni', 5.0)
  ) as v(name, price)
  join public.players p on lower(p.name) = lower(v.name)
  on conflict (tournament_id, player_id) do update
  set
    rank = excluded.rank,
    price = excluded.price,
    updated_at = now();

  raise notice 'Seeded fantasy prices for tournament %', tid;
end $$;
