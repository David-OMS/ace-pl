"use server";

import { revalidatePath } from "next/cache";

import { FANTASY_RANK_PRICES, type FantasyRank } from "@/config/fantasy";
import { checkAdminAccess } from "@/features/auth";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { adminFantasyRanksPath } from "../routes";
import { readUpsertRankForm, upsertFantasyRankSchema } from "../schemas/upsert-rank-schema";

export type UpsertFantasyRankState = ActionResult<{ savedAt: number }> | null;

export async function upsertFantasyRank(
  _previous: UpsertFantasyRankState,
  formData: FormData,
): Promise<UpsertFantasyRankState> {
  const parsed = upsertFantasyRankSchema.safeParse(readUpsertRankForm(formData));
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, playerId, rank } = parsed.data;
  const typedRank = rank as FantasyRank;
  const price = FANTASY_RANK_PRICES[typedRank];

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("fantasy_player_ranks").upsert(
    {
      tournament_id: tournamentId,
      player_id: playerId,
      rank: typedRank,
      price,
    },
    { onConflict: "tournament_id,player_id" },
  );

  if (error) {
    logger.error("upsert_fantasy_rank_failed", { error, tournamentId, playerId });
    return fail("save_failed");
  }

  revalidatePath(adminFantasyRanksPath(tournamentId));
  return ok({ savedAt: Date.now() });
}
