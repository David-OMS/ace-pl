import type { FantasyFormation } from "@/config/fantasy";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { PickablePlayer } from "../queries/list-pickable-players";
import type { PricedBatch } from "./price-transfer-swaps";
import { replaceFantasyPicks } from "./replace-fantasy-picks";
import { reseatAndRewritePicks } from "./reseat-and-rewrite-picks";

type PickRow = {
  player_id: string;
  slot: number;
  is_bench: boolean;
  is_captain: boolean;
  is_vice: boolean;
};

export async function persistFantasyTransfers(args: {
  teamId: string;
  formation: FantasyFormation;
  currentPoints: number;
  picks: readonly PickRow[];
  pool: readonly PickablePlayer[];
  batch: PricedBatch;
}): Promise<"ok" | "save_failed"> {
  const replaced = await replaceFantasyPicks({
    teamId: args.teamId,
    picks: args.picks,
    swaps: args.batch.swaps,
  });
  if (replaced !== "ok") return replaced;

  const reseated = await reseatAndRewritePicks({
    teamId: args.teamId,
    formation: args.formation,
    pool: args.pool,
  });
  if (reseated !== "ok") return reseated;

  const supabase = await createSupabaseServerClient();
  const { error: updateError } = await supabase
    .from("fantasy_teams")
    .update({
      formation: args.formation,
      bank: args.batch.bank,
      free_transfers: args.batch.freeTransfers,
      total_points: args.currentPoints - args.batch.totalHit,
    })
    .eq("id", args.teamId);

  if (updateError) {
    logger.error("transfer_update_team_failed", { error: updateError });
    return "save_failed";
  }

  if (args.batch.swaps.length === 0) return "ok";

  const { error: logError } = await supabase.from("fantasy_transfers").insert(
    args.batch.swaps.map((swap) => ({
      team_id: args.teamId,
      player_out_id: swap.playerOutId,
      player_in_id: swap.playerInId,
      point_cost: swap.pointCost,
    })),
  );

  if (logError) {
    logger.error("transfer_log_failed", { error: logError });
    return "save_failed";
  }
  return "ok";
}
