import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { canViewOtherSquad } from "../domain/can-view-other-squad";

const EMPTY = "00000000-0000-0000-0000-000000000000";

/** True once any team in the tournament has a locked gameweek snapshot. */
export async function tournamentHasLockedSquads(tournamentId: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data: days, error: daysError } = await supabase
    .from("game_days")
    .select("id")
    .eq("tournament_id", tournamentId);
  if (daysError) throw daysError;

  const dayIds = (days ?? []).map((day) => day.id);
  // Composite key table — no `id` column; count on team_id.
  const { count, error } = await supabase
    .from("fantasy_team_gameweeks")
    .select("team_id", { count: "exact", head: true })
    .in("game_day_id", dayIds.length > 0 ? dayIds : [EMPTY]);
  if (error) throw error;
  return canViewOtherSquad(count ?? 0);
}
