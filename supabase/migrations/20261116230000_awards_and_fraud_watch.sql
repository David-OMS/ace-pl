-- Fraud Watch, Baller d'Or voting, and recorded award winners.

create table public.fraud_watch_entries (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete restrict,
  caption text,
  started_on date not null default (timezone('Africa/Lagos', now()))::date,
  ended_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ended_on is null or ended_on >= started_on)
);

create index fraud_watch_entries_tournament_idx
  on public.fraud_watch_entries (tournament_id, ended_on);

create trigger fraud_watch_entries_set_updated_at
before update on public.fraud_watch_entries
for each row execute function public.set_updated_at();

alter table public.fraud_watch_entries enable row level security;

create policy "Fraud watch is public"
on public.fraud_watch_entries for select
to anon, authenticated
using (true);

create policy "Admins manage fraud watch"
on public.fraud_watch_entries for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create type public.ballon_dor_status as enum ('closed', 'open', 'revealed');

create table public.ballon_dor_rounds (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  status public.ballon_dor_status not null default 'closed',
  voting_closes_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tournament_id)
);

create trigger ballon_dor_rounds_set_updated_at
before update on public.ballon_dor_rounds
for each row execute function public.set_updated_at();

alter table public.ballon_dor_rounds enable row level security;

create policy "Ballon rounds are public"
on public.ballon_dor_rounds for select
to anon, authenticated
using (true);

create policy "Admins manage ballon rounds"
on public.ballon_dor_rounds for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create table public.ballon_dor_shortlist (
  round_id uuid not null references public.ballon_dor_rounds (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete restrict,
  stats_score integer not null default 0,
  primary key (round_id, player_id)
);

alter table public.ballon_dor_shortlist enable row level security;

create policy "Ballon shortlist is public"
on public.ballon_dor_shortlist for select
to anon, authenticated
using (true);

create policy "Admins manage ballon shortlist"
on public.ballon_dor_shortlist for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create table public.ballon_dor_votes (
  round_id uuid not null references public.ballon_dor_rounds (id) on delete cascade,
  voter_id uuid not null references public.profiles (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (round_id, voter_id)
);

alter table public.ballon_dor_votes enable row level security;

create policy "Voters see own ballon vote"
on public.ballon_dor_votes for select
to authenticated
using (
  voter_id = auth.uid()
  or exists (
    select 1 from public.ballon_dor_rounds r
    where r.id = ballon_dor_votes.round_id and r.status = 'revealed'
  )
  or public.is_admin()
);

create policy "Voters cast ballon vote"
on public.ballon_dor_votes for insert
to authenticated
with check (
  voter_id = auth.uid()
  and exists (
    select 1 from public.ballon_dor_rounds r
    where r.id = ballon_dor_votes.round_id and r.status = 'open'
  )
);

create type public.award_kind as enum (
  'golden_boot',
  'playmaker',
  'golden_glove',
  'ballon_dor'
);

create table public.tournament_awards (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  kind public.award_kind not null,
  player_id uuid not null references public.players (id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (tournament_id, kind, player_id)
);

alter table public.tournament_awards enable row level security;

create policy "Tournament awards are public"
on public.tournament_awards for select
to anon, authenticated
using (true);

create policy "Admins manage tournament awards"
on public.tournament_awards for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
