-- Fantasy ranks, squads, picks and transfers.

create type public.fantasy_rank as enum ('S', 'A', 'B', 'C');

create table public.fantasy_player_ranks (
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete cascade,
  rank public.fantasy_rank not null default 'C',
  price numeric(6, 1) not null check (price > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (tournament_id, player_id)
);

create trigger fantasy_player_ranks_set_updated_at
before update on public.fantasy_player_ranks
for each row execute function public.set_updated_at();

alter table public.fantasy_player_ranks enable row level security;

create policy "Fantasy ranks are public"
on public.fantasy_player_ranks for select
to anon, authenticated
using (true);

create policy "Admins manage fantasy ranks"
on public.fantasy_player_ranks for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create table public.fantasy_teams (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 40),
  formation text not null,
  bank numeric(8, 1) not null check (bank >= 0),
  total_points integer not null default 0,
  free_transfers smallint not null default 2 check (free_transfers >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tournament_id, user_id)
);

create trigger fantasy_teams_set_updated_at
before update on public.fantasy_teams
for each row execute function public.set_updated_at();

alter table public.fantasy_teams enable row level security;

create policy "Fantasy teams are public"
on public.fantasy_teams for select
to anon, authenticated
using (true);

create policy "Owners insert fantasy teams"
on public.fantasy_teams for insert
to authenticated
with check (user_id = auth.uid());

create policy "Owners update fantasy teams"
on public.fantasy_teams for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Owners delete fantasy teams"
on public.fantasy_teams for delete
to authenticated
using (user_id = auth.uid());

create table public.fantasy_picks (
  team_id uuid not null references public.fantasy_teams (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete restrict,
  slot smallint not null check (slot >= 0),
  is_bench boolean not null default false,
  is_captain boolean not null default false,
  is_vice boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (team_id, player_id),
  unique (team_id, slot)
);

create trigger fantasy_picks_set_updated_at
before update on public.fantasy_picks
for each row execute function public.set_updated_at();

alter table public.fantasy_picks enable row level security;

create policy "Fantasy picks are public"
on public.fantasy_picks for select
to anon, authenticated
using (true);

create policy "Owners manage fantasy picks"
on public.fantasy_picks for all
to authenticated
using (
  exists (
    select 1 from public.fantasy_teams t
    where t.id = fantasy_picks.team_id and t.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.fantasy_teams t
    where t.id = fantasy_picks.team_id and t.user_id = auth.uid()
  )
);

create table public.fantasy_transfers (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.fantasy_teams (id) on delete cascade,
  game_day_id uuid references public.game_days (id) on delete set null,
  player_out_id uuid not null references public.players (id) on delete restrict,
  player_in_id uuid not null references public.players (id) on delete restrict,
  point_cost smallint not null default 0,
  created_at timestamptz not null default now()
);

alter table public.fantasy_transfers enable row level security;

create policy "Fantasy transfers are public"
on public.fantasy_transfers for select
to anon, authenticated
using (true);

create policy "Owners insert fantasy transfers"
on public.fantasy_transfers for insert
to authenticated
with check (
  exists (
    select 1 from public.fantasy_teams t
    where t.id = fantasy_transfers.team_id and t.user_id = auth.uid()
  )
);
