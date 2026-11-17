"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import {
  ADMIN_TOURNAMENTS_PATH,
  adminTournamentPath,
  adminTournamentPlayersPath,
  adminTournamentSettingsPath,
} from "../routes";
import {
  readTournamentForm,
  toTournamentRow,
  toTournamentUpdateRow,
  tournamentInputSchema,
} from "../schemas/tournament-input-schema";
import { syncTournamentStatus } from "./sync-tournament-status";

export type TournamentFormState = ActionResult<{ savedAt: number }> | null;

const optionalIdSchema = z.uuid().nullable();

/** Creates a tournament when the form has no id, otherwise updates it. */
export async function saveTournament(
  _previous: TournamentFormState,
  formData: FormData,
): Promise<TournamentFormState> {
  const tournamentId = optionalIdSchema.safeParse(formData.get("tournamentId"));
  const parsed = tournamentInputSchema.safeParse(readTournamentForm(formData));
  if (!tournamentId.success || !parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const supabase = await createSupabaseServerClient();
  const { data, error } = tournamentId.data
    ? await supabase
        .from("tournaments")
        .update(toTournamentUpdateRow(parsed.data))
        .eq("id", tournamentId.data)
        .select("id")
        .maybeSingle()
    : await supabase
        .from("tournaments")
        .insert(toTournamentRow(parsed.data))
        .select("id")
        .maybeSingle();

  if (error) {
    logger.error("save_tournament_failed", { tournamentId: tournamentId.data, error });
    return fail("save_failed");
  }
  if (!data) return fail("not_found");

  await syncTournamentStatus(supabase, data.id);
  revalidatePath(ADMIN_TOURNAMENTS_PATH);
  if (!tournamentId.data) redirect(adminTournamentPlayersPath(data.id));
  revalidatePath(adminTournamentPath(data.id));
  revalidatePath(adminTournamentSettingsPath(data.id));
  return ok({ savedAt: Date.now() });
}
