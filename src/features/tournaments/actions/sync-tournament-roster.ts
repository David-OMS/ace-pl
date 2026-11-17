import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logger";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function removeRosterPlayers(
  supabase: Client,
  tournamentId: string,
  playerIds: readonly string[],
): Promise<boolean> {
  if (playerIds.length === 0) return true;
  await supabase
    .from("team_memberships")
    .delete()
    .eq("tournament_id", tournamentId)
    .in("player_id", playerIds)
    .is("left_on", null);
  await supabase
    .from("tournament_keepers")
    .delete()
    .eq("tournament_id", tournamentId)
    .in("player_id", playerIds);
  const { error } = await supabase
    .from("tournament_players")
    .delete()
    .eq("tournament_id", tournamentId)
    .in("player_id", playerIds);
  if (error) {
    logger.error("save_roster_remove_failed", { tournamentId, error });
    return false;
  }
  return true;
}

export async function addRosterPlayers(
  supabase: Client,
  tournamentId: string,
  playerIds: readonly string[],
): Promise<boolean> {
  if (playerIds.length === 0) return true;
  const { error } = await supabase
    .from("tournament_players")
    .insert(playerIds.map((playerId) => ({ tournament_id: tournamentId, player_id: playerId })));
  if (error) {
    logger.error("save_roster_add_failed", { tournamentId, error });
    return false;
  }
  return true;
}
