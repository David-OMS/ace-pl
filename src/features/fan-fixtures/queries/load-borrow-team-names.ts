import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/** Registered team name for players who lined up on a match. */
export async function loadBorrowTeamNames(
  tournamentId: string,
  playerIds: readonly string[],
): Promise<Map<string, string>> {
  if (playerIds.length === 0) return new Map();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("team_memberships")
    .select("player_id, teams(name)")
    .eq("tournament_id", tournamentId)
    .in("player_id", [...playerIds])
    .is("left_on", null);

  if (error) throw error;

  const names = new Map<string, string>();
  for (const row of data ?? []) {
    const teamName = row.teams?.name;
    if (teamName) names.set(row.player_id, teamName);
  }
  return names;
}
