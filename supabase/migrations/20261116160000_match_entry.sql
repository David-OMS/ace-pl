-- Match entry: who was in the squad, and what happened. Score is derived from events.

create type public.participation_status as enum ('played', 'unused_sub', 'absent');

create type public.match_event_type as enum (
  'goal',
  'own_goal',
  'saves',
  'penalty_save',
  'yellow_card',
  'red_card',
  'motm'
);

create table public.match_participations (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null,
  fixture_id uuid not null,
  player_id uuid not null references public.players (id) on delete restrict,
  -- Team they lined up for this match (own team or borrowed).
  team_id uuid not null,
  status public.participation_status not null default 'absent',
  -- Null means use the player's registered position.
  position public.player_position,
  is_goalkeeper boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (fixture_id, player_id),
  foreign key (fixture_id, tournament_id)
    references public.fixtures (id, tournament_id) on delete cascade,
  foreign key (team_id, tournament_id)
    references public.teams (id, tournament_id) on delete restrict
);

create index match_participations_fixture_idx on public.match_participations (fixture_id);
create index match_participations_player_idx on public.match_participations (player_id);

create trigger match_participations_set_updated_at
before update on public.match_participations
for each row execute function public.set_updated_at();

create trigger match_participations_record_change
after insert or update or delete on public.match_participations
for each row execute function public.record_change();

alter table public.match_participations enable row level security;

create policy "Match participations are public"
on public.match_participations for select
to anon, authenticated
using (true);

create policy "Admins manage match participations"
on public.match_participations for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create table public.match_events (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null,
  fixture_id uuid not null,
  event_type public.match_event_type not null,
  player_id uuid not null references public.players (id) on delete restrict,
  assist_player_id uuid references public.players (id) on delete restrict,
  -- Used for saves (how many). Other types stay 1.
  quantity smallint not null default 1 check (quantity >= 1 and quantity <= 50),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (assist_player_id is null or event_type = 'goal'),
  check (assist_player_id is distinct from player_id),
  check (
    (event_type = 'saves' and quantity >= 1)
    or (event_type <> 'saves' and quantity = 1)
  ),
  foreign key (fixture_id, tournament_id)
    references public.fixtures (id, tournament_id) on delete cascade
);

create index match_events_fixture_idx on public.match_events (fixture_id, sort_order);

create trigger match_events_set_updated_at
before update on public.match_events
for each row execute function public.set_updated_at();

create trigger match_events_record_change
after insert or update or delete on public.match_events
for each row execute function public.record_change();

alter table public.match_events enable row level security;

create policy "Match events are public"
on public.match_events for select
to anon, authenticated
using (true);

create policy "Admins manage match events"
on public.match_events for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- One Man of the Match per fixture.
create unique index match_events_one_motm_idx
on public.match_events (fixture_id)
where event_type = 'motm';
