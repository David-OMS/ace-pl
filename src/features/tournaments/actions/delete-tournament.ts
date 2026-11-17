"use server";

import { revalidatePath } from "next/cache";

import { revalidateFanPublic } from "@/lib/cache/fan-public-cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { fail, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { ADMIN_TOURNAMENTS_PATH } from "../routes";

export type DeleteTournamentState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({ tournamentId: z.uuid() });

export async function deleteTournament(
  _previous: DeleteTournamentState,
  formData: FormData,
): Promise<DeleteTournamentState> {
  const parsed = schema.safeParse({ tournamentId: formData.get("tournamentId") });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("tournaments").delete().eq("id", tournamentId);

  if (error) {
    logger.error("delete_tournament_failed", { tournamentId, error });
    return fail("save_failed");
  }

  revalidatePath(ADMIN_TOURNAMENTS_PATH);
  revalidateFanPublic();
  redirect(ADMIN_TOURNAMENTS_PATH);
}
