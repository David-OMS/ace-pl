"use server";

import { revalidatePath } from "next/cache";

import { checkAdminAccess } from "@/features/auth";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { FAN_HOME_PATH } from "@/features/fan";

import { AWARDS_ADMIN_PATH } from "../routes";

export type EndFraudWatchState = ActionResult<{ id: string }> | null;

export async function endFraudWatch(
  _previous: EndFraudWatchState,
  formData: FormData,
): Promise<EndFraudWatchState> {
  const access = await checkAdminAccess();
  if (access) return fail(access);

  const entryId = String(formData.get("entryId") ?? "");
  if (!entryId) return fail("invalid_input");

  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("fraud_watch_entries")
    .update({ ended_on: today })
    .eq("id", entryId)
    .is("ended_on", null)
    .select("id")
    .maybeSingle();

  if (error) {
    logger.error("end_fraud_watch_failed", { error });
    return fail("save_failed");
  }
  if (!data) return fail("not_found");

  revalidatePath(AWARDS_ADMIN_PATH);
  revalidatePath(FAN_HOME_PATH);
  return ok({ id: data.id });
}
