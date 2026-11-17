import "server-only";

import { FANTASY_PRICE_FLOOR, rankFromPrice } from "@/config/fantasy";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/** Insert floor price for roster players missing a rank row. */
export async function ensureDefaultRanks(tournamentId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const [roster, ranks] = await Promise.all([
    supabase.from("tournament_players").select("player_id").eq("tournament_id", tournamentId),
    supabase.from("fantasy_player_ranks").select("player_id").eq("tournament_id", tournamentId),
  ]);

  if (roster.error) throw roster.error;
  if (ranks.error) throw ranks.error;

  const ranked = new Set((ranks.data ?? []).map((r) => r.player_id));
  const missing = (roster.data ?? []).map((r) => r.player_id).filter((id) => !ranked.has(id));

  if (missing.length === 0) return;

  const price = FANTASY_PRICE_FLOOR;
  const { error } = await supabase.from("fantasy_player_ranks").insert(
    missing.map((playerId) => ({
      tournament_id: tournamentId,
      player_id: playerId,
      rank: rankFromPrice(price),
      price,
    })),
  );

  if (error) {
    logger.error("ensure_default_ranks_failed", { tournamentId, error });
    throw error;
  }
}
