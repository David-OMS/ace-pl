-- Older match_participations rows had null position; CS scoring needs DEF/MID/GK.
update public.match_participations as mp
set
  position = p.position,
  is_goalkeeper = (p.position = 'GK')
from public.players as p
where mp.player_id = p.id
  and (mp.position is null or (mp.position = 'GK') is distinct from (p.position = 'GK'));
