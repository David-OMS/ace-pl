import "server-only";

import { FANTASY_FREE_TRANSFERS_PER_GW } from "@/config/fantasy";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/** Reset every team in the tournament to the per-GW free transfer allowance. */
export async function refreshFreeTransfers(tournamentId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("fantasy_teams")
    .update({ free_transfers: FANTASY_FREE_TRANSFERS_PER_GW })
    .eq("tournament_id", tournamentId);
  if (error) {
    logger.error("fantasy_free_transfers_refresh_failed", { tournamentId, error });
  }
}
