import { FANTASY_SQUAD_SIZE, type FantasyFormation } from "@/config/fantasy";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { isFantasyFormation } from "../domain/parse-formation";
import { reseatPicksForFormation } from "../domain/reseat-picks-for-formation";
import type { PickablePlayer } from "../queries/list-pickable-players";

/** Delete+insert avoids unique(slot) clashes when swapping seats in place. */
export async function reseatAndRewritePicks(args: {
  teamId: string;
  formation: FantasyFormation;
  pool: readonly PickablePlayer[];
}): Promise<"ok" | "save_failed"> {
  if (!isFantasyFormation(args.formation)) return "save_failed";

  const loaded = await loadPicksForReseat(args.teamId, args.pool);
  if (!loaded) return "save_failed";

  const reseated = reseatPicksForFormation({
    formation: args.formation,
    squadSize: FANTASY_SQUAD_SIZE,
    picks: loaded.input,
  });
  if (reseated.length !== loaded.count) {
    logger.error("transfer_reseat_incomplete", {
      teamId: args.teamId,
      expected: loaded.count,
      got: reseated.length,
    });
    return "save_failed";
  }

  return writeReseatedPicks(args.teamId, reseated, loaded.priceById);
}

async function loadPicksForReseat(teamId: string, pool: readonly PickablePlayer[]) {
  const supabase = await createSupabaseServerClient();
  const { data: freshPicks, error } = await supabase
    .from("fantasy_picks")
    .select("player_id, is_captain, is_vice, purchase_price")
    .eq("team_id", teamId);
  if (error || !freshPicks) {
    logger.error("transfer_reload_picks_failed", { error });
    return null;
  }

  const byId = new Map(pool.map((p) => [p.id, p]));
  const priceById = new Map(freshPicks.map((row) => [row.player_id, Number(row.purchase_price)]));
  const input = freshPicks.flatMap((row) => {
    const player = byId.get(row.player_id);
    if (!player) return [];
    return [
      {
        playerId: row.player_id,
        position: player.position,
        price: player.price,
        isCaptain: row.is_captain,
        isVice: row.is_vice,
      },
    ];
  });
  return { input, priceById, count: freshPicks.length };
}

async function writeReseatedPicks(
  teamId: string,
  reseated: readonly {
    playerId: string;
    price: number;
    isBench: boolean;
    isCaptain: boolean;
    isVice: boolean;
  }[],
  priceById: ReadonlyMap<string, number>,
): Promise<"ok" | "save_failed"> {
  const supabase = await createSupabaseServerClient();
  const { error: clearError } = await supabase.from("fantasy_picks").delete().eq("team_id", teamId);
  if (clearError) {
    logger.error("transfer_reseat_clear_failed", { error: clearError });
    return "save_failed";
  }

  const { error: insertError } = await supabase.from("fantasy_picks").insert(
    reseated.map((pick, slot) => ({
      team_id: teamId,
      player_id: pick.playerId,
      slot,
      is_bench: pick.isBench,
      is_captain: pick.isCaptain,
      is_vice: pick.isVice,
      purchase_price: priceById.get(pick.playerId) ?? pick.price,
    })),
  );
  if (insertError) {
    logger.error("transfer_reseat_insert_failed", { error: insertError });
    return "save_failed";
  }
  return "ok";
}
