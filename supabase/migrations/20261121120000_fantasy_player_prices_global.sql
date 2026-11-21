-- Global fantasy prices (one row per player). Tournament ranks stay as a mirror for now.

create table public.fantasy_player_prices (
  player_id uuid primary key references public.players (id) on delete cascade,
  rank public.fantasy_rank not null default 'C',
  price numeric(6, 1) not null check (price > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger fantasy_player_prices_set_updated_at
before update on public.fantasy_player_prices
for each row execute function public.set_updated_at();

alter table public.fantasy_player_prices enable row level security;

create policy "Fantasy prices are public"
on public.fantasy_player_prices for select
to anon, authenticated
using (true);

create policy "Admins manage fantasy prices"
on public.fantasy_player_prices for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Prefer the newest tournament rank row when deduping.
insert into public.fantasy_player_prices (player_id, rank, price, created_at, updated_at)
select distinct on (player_id)
  player_id,
  rank,
  price,
  created_at,
  updated_at
from public.fantasy_player_ranks
order by player_id, updated_at desc;

-- Keep tournament mirror in sync for any leftover readers.
update public.fantasy_player_ranks r
set
  price = p.price,
  rank = p.rank
from public.fantasy_player_prices p
where r.player_id = p.player_id;
