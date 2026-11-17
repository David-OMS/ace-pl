-- Shared vs per-team keepers. Also used by admin tournament setup.

create type public.keeper_mode as enum ('per_team', 'shared');

alter table public.tournaments
  add column keeper_mode public.keeper_mode not null default 'shared';

-- When keeper_mode = shared, these players are the tournament keeper pool.
create table public.tournament_keepers (
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (tournament_id, player_id)
);

alter table public.tournament_keepers enable row level security;

create policy "Tournament keepers are public"
on public.tournament_keepers for select
to anon, authenticated
using (true);

create policy "Admins manage tournament keepers"
on public.tournament_keepers for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create trigger tournament_keepers_record_change
after insert or update or delete on public.tournament_keepers
for each row execute function public.record_change();
