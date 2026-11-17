-- tournament_players / tournament_keepers have no `id` column. The change-log
-- trigger used only `id`, so inserts failed with a null record_id.

create or replace function public.record_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_data jsonb := to_jsonb(coalesce(new, old));
  row_id text := coalesce(
    row_data ->> 'id',
    nullif(
      concat_ws(
        ':',
        row_data ->> 'tournament_id',
        row_data ->> 'player_id'
      ),
      ''
    ),
    'unknown'
  );
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
