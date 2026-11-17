-- Tournament window (wall-clock league dates) and explicit tournament squad.

alter table public.tournaments
  add column starts_on date,
  add column ends_on date;

alter table public.tournaments
  add constraint tournaments_date_range_check
  check (ends_on is null or starts_on is null or ends_on >= starts_on);

-- Players selected for this tournament before they are put into teams.
create table public.tournament_players (
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (tournament_id, player_id)
);

alter table public.tournament_players enable row level security;

create policy "Tournament players are public"
on public.tournament_players for select
to anon, authenticated
using (true);

create policy "Admins manage tournament players"
on public.tournament_players for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create trigger tournament_players_record_change
after insert or update or delete on public.tournament_players
for each row execute function public.record_change();
