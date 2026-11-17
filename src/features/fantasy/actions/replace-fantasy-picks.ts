import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { PricedSwap } from "./price-transfer-swaps";

type PickRow = {
  player_id: string;
  slot: number;
  is_bench: boolean;
  is_captain: boolean;
  is_vice: boolean;
};

export async function replaceFantasyPicks(args: {
  teamId: string;
  picks: readonly PickRow[];
  swaps: readonly PricedSwap[];
}): Promise<"ok" | "save_failed"> {
  const supabase = await createSupabaseServerClient();
  const pickByOut = new Map(args.picks.map((p) => [p.player_id, p]));

  for (const swap of args.swaps) {
    const outgoing = pickByOut.get(swap.playerOutId);
    if (!outgoing) return "save_failed";
    const { error: delError } = await supabase
      .from("fantasy_picks")
      .delete()
      .eq("team_id", args.teamId)
      .eq("player_id", swap.playerOutId);
    if (delError) {
      logger.error("transfer_delete_pick_failed", { error: delError });
      return "save_failed";
    }
    const { error: insError } = await supabase.from("fantasy_picks").insert({
      team_id: args.teamId,
      player_id: swap.playerInId,
      slot: outgoing.slot,
      is_bench: outgoing.is_bench,
      is_captain: outgoing.is_captain,
      is_vice: outgoing.is_vice,
      purchase_price: swap.inPrice,
    });
    if (insError) {
      logger.error("transfer_insert_pick_failed", { error: insError });
      return "save_failed";
    }
  }
  return "ok";
}
