-- Ensure existing teams get distinct kit colours (safe if already updated).
with ranked as (
  select
    id,
    color,
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
where t.id = ranked.id
  and t.color = '#2b2d42'
  and ranked.next_color is distinct from '#2b2d42';
