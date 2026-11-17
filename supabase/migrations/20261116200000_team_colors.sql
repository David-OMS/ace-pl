-- Kit colour per team (crest chips in admin / fixtures). Editable later; seeded randomly on create.

alter table public.teams
  add column color text not null default '#2b2d42';

alter table public.teams
  add constraint teams_color_hex_check
  check (color ~ '^#[0-9A-Fa-f]{6}$');

-- Spread palette colours across existing teams so crests aren't all the same default.
with ranked as (
  select
    id,
    (
      array[
        '#e63946', '#1d70b8', '#2a9d8f', '#f4a100',
        '#2b2d42', '#6a4c93', '#ff3d00', '#1a8a3a'
      ]
    )[
      ((row_number() over (partition by tournament_id order by created_at, name) - 1) % 8) + 1
    ] as next_color
  from public.teams
)
update public.teams as t
set color = ranked.next_color
from ranked
where t.id = ranked.id;
