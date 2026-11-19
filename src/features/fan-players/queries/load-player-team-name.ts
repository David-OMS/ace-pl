import "server-only";

import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

/** Current club for this tournament; null if unassigned. */
export async function loadPlayerTeamName(
  tournamentId: string,
  playerId: string,
): Promise<string | null> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("team_memberships")
    .select("teams(name)")
    .eq("tournament_id", tournamentId)
    .eq("player_id", playerId)
    .is("left_on", null)
    .maybeSingle();
  if (error) throw error;
  return data?.teams?.name ?? null;
}
