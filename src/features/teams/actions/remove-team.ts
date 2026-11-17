"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { adminTournamentPath } from "@/features/tournaments";
import { fail, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type RemoveTeamState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  tournamentId: z.uuid(),
  teamId: z.uuid(),
});

/** Fails if the team is already on a fixture (foreign key). */
export async function removeTeam(
  _previous: RemoveTeamState,
  formData: FormData,
): Promise<RemoveTeamState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    teamId: formData.get("teamId"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, teamId } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("teams").delete().eq("id", teamId);

  if (error) {
    logger.error("remove_team_failed", { teamId, error });
    return fail("save_failed");
  }
  revalidatePath(adminTournamentPath(tournamentId));
  redirect(adminTournamentPath(tournamentId));
}
