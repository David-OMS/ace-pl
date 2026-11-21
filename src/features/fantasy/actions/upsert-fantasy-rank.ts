"use server";

import { revalidatePath } from "next/cache";

import { rankFromPrice } from "@/config/fantasy-ranks";
import { checkAdminAccess } from "@/features/auth";
import { ADMIN_PLAYER_PRICES_PATH } from "@/features/players";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

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

  const { playerId, price } = parsed.data;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("fantasy_player_prices").upsert(
    {
      player_id: playerId,
      rank: rankFromPrice(price),
      price,
    },
    { onConflict: "player_id" },
  );

  if (error) {
    logger.error("upsert_fantasy_rank_failed", { error, playerId });
    return fail("save_failed");
  }

  revalidatePath(ADMIN_PLAYER_PRICES_PATH);
  return ok({ savedAt: Date.now() });
}
