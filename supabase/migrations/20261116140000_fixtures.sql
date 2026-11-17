-- Fixtures: admin-entered matches on a game day. Schedule generation comes later.

alter table public.game_days
  add constraint game_days_id_tournament_id_key unique (id, tournament_id);

create type public.fixture_status as enum (
  'draft',
  'published',
  'completed',
  'postponed',
  'void',
  'walkover'
);

create table public.fixtures (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  game_day_id uuid not null,
  home_team_id uuid not null,
  away_team_id uuid not null,
  -- League wall-clock on the game day (Africa/Lagos). Not an absolute instant;
  -- created_at/updated_at stay timestamptz (UTC). Kick-off as timestamptz only if we need it later.
  kickoff_time time not null,
  status public.fixture_status not null default 'draft',
  -- Set when status is walkover: the team that received the 3–0.
  walkover_winner_team_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, tournament_id),
  check (home_team_id <> away_team_id),
  check (
    walkover_winner_team_id is null
    or walkover_winner_team_id in (home_team_id, away_team_id)
  ),
  check (
    (status = 'walkover' and walkover_winner_team_id is not null)
    or (status <> 'walkover' and walkover_winner_team_id is null)
  ),
  foreign key (game_day_id, tournament_id)
    references public.game_days (id, tournament_id) on delete cascade,
  foreign key (home_team_id, tournament_id)
    references public.teams (id, tournament_id) on delete restrict,
  foreign key (away_team_id, tournament_id)
    references public.teams (id, tournament_id) on delete restrict
);

create index fixtures_game_day_idx on public.fixtures (game_day_id, kickoff_time);
create index fixtures_tournament_idx on public.fixtures (tournament_id);

create trigger fixtures_set_updated_at
before update on public.fixtures
for each row execute function public.set_updated_at();

create trigger fixtures_record_change
after insert or update or delete on public.fixtures
for each row execute function public.record_change();

alter table public.fixtures enable row level security;

create policy "Fixtures are public"
on public.fixtures for select
to anon, authenticated
using (true);

create policy "Admins manage fixtures"
on public.fixtures for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
