"use server";

import { revalidatePath } from "next/cache";

import { rankFromPrice } from "@/config/fantasy-ranks";
import { getCurrentUser } from "@/features/auth";
import { fail, ok, type ActionErrorCode, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { adminFantasyRanksPath } from "../routes";
import { readUpsertRankForm, upsertFantasyRankSchema } from "../schemas/upsert-rank-schema";
import { isFantasyPriceAdmin } from "../server/is-fantasy-price-admin";

export type UpsertFantasyRankState = ActionResult<{ savedAt: number }> | null;

export async function upsertFantasyRank(
  _previous: UpsertFantasyRankState,
  formData: FormData,
): Promise<UpsertFantasyRankState> {
  const parsed = upsertFantasyRankSchema.safeParse(readUpsertRankForm(formData));
  if (!parsed.success) return fail("invalid_input");

  const accessError = await priceAdminError();
  if (accessError) return fail(accessError);

  const { tournamentId, playerId, price } = parsed.data;

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
    logger.error("upsert_fantasy_rank_failed", { error, tournamentId, playerId });
    return fail("save_failed");
  }

  revalidatePath(adminFantasyRanksPath(tournamentId));
  return ok({ savedAt: Date.now() });
}

async function priceAdminError(): Promise<ActionErrorCode | null> {
  const user = await getCurrentUser();
  if (!user) return "unauthenticated";
  if (!user.isAdmin || !isFantasyPriceAdmin(user.id)) return "forbidden";
  return null;
}
