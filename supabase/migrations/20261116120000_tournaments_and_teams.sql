-- Tournaments, teams, team membership (with permanent transfers), game days and the admin change log.

create function public.lagos_today()
returns date
language sql
stable
set search_path = ''
as $$
  select (now() at time zone 'Africa/Lagos')::date;
$$;

-- Change log: who changed what, before and after. Admin-only reading; rows written by triggers only.

create table public.change_log (
  id bigint generated always as identity primary key,
  table_name text not null,
  record_id text not null,
  action text not null check (action in ('insert', 'update', 'delete')),
  actor_id uuid references public.profiles (id) on delete set null,
  before_row jsonb,
  after_row jsonb,
  reason text,
  created_at timestamptz not null default now()
);

create index change_log_record_idx on public.change_log (table_name, record_id);
create index change_log_created_at_idx on public.change_log (created_at desc);

alter table public.change_log enable row level security;

create policy "Admins read the change log"
on public.change_log for select
to authenticated
using (public.is_admin());

revoke insert, update, delete on public.change_log from anon, authenticated;

-- An action can explain itself with: select set_config('ace.change_reason', 'why', true);
create function public.record_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_id text := coalesce(to_jsonb(new) ->> 'id', to_jsonb(old) ->> 'id');
begin
  insert into public.change_log (table_name, record_id, action, actor_id, before_row, after_row, reason)
  values (
    tg_table_name,
    row_id,
    lower(tg_op),
    (select auth.uid()),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end,
    nullif(current_setting('ace.change_reason', true), '')
  );
  return coalesce(new, old);
end;
$$;

create trigger players_record_change
after insert or update or delete on public.players
for each row execute function public.record_change();

-- Tournaments: one per month. Rule settings live here so they can change without code.

create type public.tournament_status as enum ('setup', 'active', 'completed');
create type public.first_place_tiebreak as enum ('discipline', 'playoff');

create table public.tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 60),
  status public.tournament_status not null default 'setup',
  players_on_pitch smallint not null default 6 check (players_on_pitch between 2 and 11),
  squad_size smallint not null default 10 check (squad_size between 2 and 30),
  matches_per_game_day smallint not null default 4 check (matches_per_game_day between 1 and 12),
  first_place_tiebreak public.first_place_tiebreak not null default 'discipline',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (squad_size >= players_on_pitch)
);

create trigger tournaments_set_updated_at
before update on public.tournaments
for each row execute function public.set_updated_at();

create trigger tournaments_record_change
after insert or update or delete on public.tournaments
for each row execute function public.record_change();

alter table public.tournaments enable row level security;

create policy "Tournaments are public"
on public.tournaments for select
to anon, authenticated
using (true);

create policy "Admins manage tournaments"
on public.tournaments for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Teams belong to one tournament. Names can repeat across tournaments, not within one.

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 30),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, tournament_id)
);

create unique index teams_name_per_tournament_idx on public.teams (tournament_id, lower(trim(name)));

create trigger teams_set_updated_at
before update on public.teams
for each row execute function public.set_updated_at();

create trigger teams_record_change
after insert or update or delete on public.teams
for each row execute function public.record_change();

alter table public.teams enable row level security;

create policy "Teams are public"
on public.teams for select
to anon, authenticated
using (true);

create policy "Admins manage teams"
on public.teams for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Team membership. A closed row (left_on set) is history from a permanent transfer.
-- Borrowing for a single match is not a membership; it lives on the match lineup.

create table public.team_memberships (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null,
  team_id uuid not null,
  player_id uuid not null references public.players (id) on delete restrict,
  joined_on date not null default public.lagos_today(),
  left_on date,
  is_captain boolean not null default false,
  created_at timestamptz not null default now(),
  foreign key (team_id, tournament_id) references public.teams (id, tournament_id) on delete cascade,
  check (left_on is null or left_on >= joined_on),
  check (not is_captain or left_on is null)
);

create unique index team_memberships_one_captain_idx
on public.team_memberships (team_id)
where is_captain;

create unique index team_memberships_one_current_team_idx
on public.team_memberships (tournament_id, player_id)
where left_on is null;

create index team_memberships_team_idx on public.team_memberships (team_id);

create trigger team_memberships_record_change
after insert or update or delete on public.team_memberships
for each row execute function public.record_change();

alter table public.team_memberships enable row level security;

create policy "Team memberships are public"
on public.team_memberships for select
to anon, authenticated
using (true);

create policy "Admins manage team memberships"
on public.team_memberships for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Puts a player in a team. Before kick-off it just moves them; once the tournament
-- is active it closes the old membership and opens a new one, so history stays intact.
create function public.assign_player_to_team(target_player_id uuid, target_team_id uuid)
returns void
language plpgsql
set search_path = ''
as $$
declare
  target_tournament_id uuid;
  target_status public.tournament_status;
  current_membership public.team_memberships;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  select t.tournament_id, tr.status into target_tournament_id, target_status
  from public.teams t
  join public.tournaments tr on tr.id = t.tournament_id
  where t.id = target_team_id;

  if target_tournament_id is null then
    raise exception 'team_not_found';
  end if;

  select * into current_membership
  from public.team_memberships m
  where m.tournament_id = target_tournament_id
    and m.player_id = target_player_id
    and m.left_on is null;

  if current_membership.team_id = target_team_id then
    return;
  end if;

  -- Captaincy belongs to a team, so it never follows a player to a new one.
  if current_membership.id is not null and target_status = 'setup' then
    update public.team_memberships
    set team_id = target_team_id, is_captain = false
    where id = current_membership.id;
    return;
  end if;

  if current_membership.id is not null then
    update public.team_memberships
    set left_on = public.lagos_today(), is_captain = false
    where id = current_membership.id;
  end if;

  insert into public.team_memberships (tournament_id, team_id, player_id)
  values (target_tournament_id, target_team_id, target_player_id);
end;
$$;

revoke execute on function public.assign_player_to_team (uuid, uuid) from public, anon;
grant execute on function public.assign_player_to_team (uuid, uuid) to authenticated;

create function public.set_team_captain(target_team_id uuid, target_player_id uuid)
returns void
language plpgsql
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  -- Two statements, because the one-captain index is checked row by row.
  update public.team_memberships
  set is_captain = false
  where team_id = target_team_id and is_captain;

  update public.team_memberships
  set is_captain = true
  where team_id = target_team_id and player_id = target_player_id and left_on is null;

  if not found then
    raise exception 'not_in_team';
  end if;
end;
$$;

revoke execute on function public.set_team_captain (uuid, uuid) from public, anon;
grant execute on function public.set_team_captain (uuid, uuid) to authenticated;

-- Game days: the Fridays (usually) chosen by admins. Each one is also a fantasy gameweek.

create table public.game_days (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  played_on date not null,
  created_at timestamptz not null default now(),
  unique (tournament_id, played_on)
);

create trigger game_days_record_change
after insert or update or delete on public.game_days
for each row execute function public.record_change();

alter table public.game_days enable row level security;

create policy "Game days are public"
on public.game_days for select
to anon, authenticated
using (true);

create policy "Admins manage game days"
on public.game_days for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
