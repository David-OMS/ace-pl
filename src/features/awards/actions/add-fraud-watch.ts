"use server";

import { revalidatePath } from "next/cache";

import { FRAUD_WATCH_MAX_OPEN } from "@/config/awards";
import { checkAdminAccess } from "@/features/auth";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { FAN_HOME_PATH } from "@/features/fan";

import { AWARDS_ADMIN_PATH } from "../routes";

export type AddFraudWatchState = ActionResult<{ id: string }> | null;

// eslint-disable-next-line complexity -- admin form validation branches
export async function addFraudWatch(
  _previous: AddFraudWatchState,
  formData: FormData,
): Promise<AddFraudWatchState> {
  const access = await checkAdminAccess();
  if (access) return fail(access);

  const tournamentId = String(formData.get("tournamentId") ?? "");
  const playerId = String(formData.get("playerId") ?? "");
  const caption = String(formData.get("caption") ?? "").trim() || null;
  if (!tournamentId || !playerId) return fail("invalid_input");

  const supabase = await createSupabaseServerClient();
  const { count, error: countError } = await supabase
    .from("fraud_watch_entries")
    .select("id", { count: "exact", head: true })
    .eq("tournament_id", tournamentId)
    .is("ended_on", null);
  if (countError) throw countError;
  if ((count ?? 0) >= FRAUD_WATCH_MAX_OPEN) return fail("conflict");

  const { data, error } = await supabase
    .from("fraud_watch_entries")
    .insert({
      tournament_id: tournamentId,
      player_id: playerId,
      caption,
    })
    .select("id")
    .single();

  if (error || !data) {
    logger.error("add_fraud_watch_failed", { error });
    return fail("save_failed");
  }

  revalidatePath(AWARDS_ADMIN_PATH);
  revalidatePath(FAN_HOME_PATH);
  return ok({ id: data.id });
}
