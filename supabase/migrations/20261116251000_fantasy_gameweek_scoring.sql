-- Per-gameweek fantasy snapshots and scored picks.
-- Admins may update team totals when publishing match results.

create policy "Admins update fantasy teams"
on public.fantasy_teams for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create table public.fantasy_team_gameweeks (
  team_id uuid not null references public.fantasy_teams (id) on delete cascade,
  game_day_id uuid not null references public.game_days (id) on delete cascade,
  points integer not null default 0,
  formation text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (team_id, game_day_id)
);

create trigger fantasy_team_gameweeks_set_updated_at
before update on public.fantasy_team_gameweeks
for each row execute function public.set_updated_at();

alter table public.fantasy_team_gameweeks enable row level security;

create policy "Fantasy team gameweeks are public"
on public.fantasy_team_gameweeks for select
to anon, authenticated
using (true);

create policy "Admins manage fantasy team gameweeks"
on public.fantasy_team_gameweeks for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create table public.fantasy_gameweek_picks (
  team_id uuid not null,
  game_day_id uuid not null,
  player_id uuid not null references public.players (id) on delete restrict,
  slot smallint not null check (slot >= 0),
  is_bench boolean not null default false,
  is_captain boolean not null default false,
  is_vice boolean not null default false,
  raw_points integer not null default 0,
  applied_points integer not null default 0,
  in_xi boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (team_id, game_day_id, player_id),
  unique (team_id, game_day_id, slot),
  foreign key (team_id, game_day_id)
    references public.fantasy_team_gameweeks (team_id, game_day_id)
    on delete cascade
);

create trigger fantasy_gameweek_picks_set_updated_at
before update on public.fantasy_gameweek_picks
for each row execute function public.set_updated_at();

alter table public.fantasy_gameweek_picks enable row level security;

create policy "Fantasy gameweek picks are public"
on public.fantasy_gameweek_picks for select
to anon, authenticated
using (true);

create policy "Admins manage fantasy gameweek picks"
on public.fantasy_gameweek_picks for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
