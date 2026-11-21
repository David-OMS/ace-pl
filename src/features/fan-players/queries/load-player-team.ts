import "server-only";

import { DEFAULT_TEAM_COLOR } from "@/config/team-colors";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

export type FanPlayerTeam = {
  name: string;
  color: string;
};

/** Current club for this tournament; null if unassigned. */
export async function loadPlayerTeam(
  tournamentId: string,
  playerId: string,
): Promise<FanPlayerTeam | null> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("team_memberships")
    .select("teams(name, color)")
    .eq("tournament_id", tournamentId)
    .eq("player_id", playerId)
    .is("left_on", null)
    .maybeSingle();
  if (error) throw error;
  const team = data?.teams;
  if (!team?.name) return null;
  return {
    name: team.name,
    color: team.color || DEFAULT_TEAM_COLOR,
  };
}
