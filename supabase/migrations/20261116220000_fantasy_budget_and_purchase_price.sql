-- Tournament fantasy budget (source of truth; not derived from squad size).
-- Purchase price on picks for FPL-style sell-on when prices move.

alter table public.tournaments
  add column if not exists fantasy_budget numeric(8, 1) not null default 72
  check (fantasy_budget > 0);

comment on column public.tournaments.fantasy_budget is
  'Fantasy team budget in ₦m for this tournament (v1 default 72).';

alter table public.fantasy_picks
  add column if not exists purchase_price numeric(6, 1);

comment on column public.fantasy_picks.purchase_price is
  'Price paid when the player joined the squad; used for sell value.';

update public.fantasy_picks fp
set purchase_price = coalesce(
  (
    select r.price
    from public.fantasy_player_ranks r
    join public.fantasy_teams t on t.id = fp.team_id
    where r.tournament_id = t.tournament_id
      and r.player_id = fp.player_id
  ),
  5.0
)
where purchase_price is null;

alter table public.fantasy_picks
  alter column purchase_price set default 5.0;

alter table public.fantasy_picks
  alter column purchase_price set not null;

alter table public.fantasy_picks
  drop constraint if exists fantasy_picks_purchase_price_check;

alter table public.fantasy_picks
  add constraint fantasy_picks_purchase_price_check
  check (purchase_price > 0);
