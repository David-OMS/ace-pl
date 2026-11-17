import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logger";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

/** Assigns each player via RPC; returns false if any assign fails. */
export async function assignPlayersToTeam(
  supabase: Client,
  teamId: string,
  playerIds: readonly string[],
): Promise<boolean> {
  for (const playerId of playerIds) {
    const { error } = await supabase.rpc("assign_player_to_team", {
      target_player_id: playerId,
      target_team_id: teamId,
    });
    if (error) {
      logger.error("assign_players_to_team_failed", { playerId, teamId, error });
      return false;
    }
  }
  return true;
}

export async function rosterContainsAll(
  supabase: Client,
  tournamentId: string,
  playerIds: readonly string[],
): Promise<boolean | "error"> {
  if (playerIds.length === 0) return true;
  const { data, error } = await supabase
    .from("tournament_players")
    .select("player_id")
    .eq("tournament_id", tournamentId)
    .in("player_id", playerIds);
  if (error) {
    logger.error("roster_contains_check_failed", { tournamentId, error });
    return "error";
  }
  return (data ?? []).length === playerIds.length;
}
