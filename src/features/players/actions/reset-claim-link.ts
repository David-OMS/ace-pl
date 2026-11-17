"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { adminPlayerPath } from "../routes";

export type ResetClaimLinkState = ActionResult<{ resetAt: number }> | null;

const playerIdSchema = z.uuid();

/** Replaces the claim token, so any link already sent stops working. */
export async function resetClaimLink(
  _previous: ResetClaimLinkState,
  formData: FormData,
): Promise<ResetClaimLinkState> {
  const playerId = playerIdSchema.safeParse(formData.get("playerId"));
  if (!playerId.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("player_claim_tokens")
    .upsert({ player_id: playerId.data, token: crypto.randomUUID() });

  if (error) {
    logger.error("reset_claim_link_failed", { playerId: playerId.data, error });
    return fail("save_failed");
  }
  revalidatePath(adminPlayerPath(playerId.data));
  return ok({ resetAt: Date.now() });
}
