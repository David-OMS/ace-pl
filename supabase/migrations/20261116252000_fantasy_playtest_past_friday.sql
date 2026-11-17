-- Playtest: push earliest Friday into the past so the first transfer deadline has passed.
-- Deadline = Thursday 23:59 Lagos before that Friday.
-- Demo tournament only. Safe to re-run.

do $$
declare
  tid uuid;
  earliest date;
begin
  select id into tid
  from public.tournaments
  where name = 'Ace Ballerz League 2026'
  order by created_at desc
  limit 1;

  if tid is null then
    raise notice 'No Ace Ballerz League 2026 — skipped playtest game day shift.';
    return;
  end if;

  -- Friday 14 Nov 2026 (before "today" Mon 16 Nov 2026 in playtest).
  earliest := date '2026-11-14';

  update public.game_days gd
  set played_on = earliest
  where gd.id = (
    select id from public.game_days
    where tournament_id = tid
    order by played_on asc
    limit 1
  );

  raise notice 'Earliest game day set to % for playtest (1 FT / locked transfers).', earliest;
  raise notice 'When ready to score: set a fixture on that game day kickoff_time to now()+interval ''5 minutes'', enter events, Publish.';
end $$;
