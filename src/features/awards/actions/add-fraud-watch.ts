"use server";

import { revalidatePath } from "next/cache";

import { revalidateFanPublic } from "@/lib/cache/fan-public-cache";

import { FRAUD_WATCH_MAX_OPEN } from "@/config/awards";
import { checkAdminAccess } from "@/features/auth";
import { FAN_HOME_PATH } from "@/features/fan";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { AWARDS_ADMIN_PATH } from "../routes";

export type AddFraudWatchState = ActionResult<{ id: string }> | null;

export async function addFraudWatch(
  _previous: AddFraudWatchState,
  formData: FormData,
): Promise<AddFraudWatchState> {
  const access = await checkAdminAccess();
  if (access) return fail(access);

  const subject = parseFraudSubject(String(formData.get("subject") ?? ""));
  if (!subject) return fail("invalid_input");
  const caption = String(formData.get("caption") ?? "").trim() || null;

  const inserted = await insertFraudWatch(subject, caption);
  if (!inserted.ok) return fail(inserted.error);

  revalidatePath(AWARDS_ADMIN_PATH);
  revalidatePath(FAN_HOME_PATH);
  revalidateFanPublic();
  return ok({ id: inserted.id });
}

async function insertFraudWatch(
  subject: { playerId: string | null; teamId: string | null },
  caption: string | null,
): Promise<{ ok: true; id: string } | { ok: false; error: "conflict" | "save_failed" }> {
  const supabase = await createSupabaseServerClient();
  const { count, error: countError } = await supabase
    .from("fraud_watch_entries")
    .select("id", { count: "exact", head: true })
    .is("ended_on", null);
  if (countError) throw countError;
  if ((count ?? 0) >= FRAUD_WATCH_MAX_OPEN) return { ok: false, error: "conflict" };

  const { data, error } = await supabase
    .from("fraud_watch_entries")
    .insert({
      player_id: subject.playerId,
      team_id: subject.teamId,
      caption,
    })
    .select("id")
    .single();

  if (error || !data) {
    logger.error("add_fraud_watch_failed", { error });
    return { ok: false, error: "save_failed" };
  }
  return { ok: true, id: data.id };
}

function parseFraudSubject(
  raw: string,
): { playerId: string | null; teamId: string | null } | null {
  if (raw.startsWith("player:")) {
    const playerId = raw.slice("player:".length);
    return playerId ? { playerId, teamId: null } : null;
  }
  if (raw.startsWith("team:")) {
    const teamId = raw.slice("team:".length);
    return teamId ? { playerId: null, teamId } : null;
  }
  return null;
}
