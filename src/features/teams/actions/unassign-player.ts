"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { adminTeamPath, adminTournamentPath } from "@/features/tournaments";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type UnassignPlayerState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  tournamentId: z.uuid(),
  playerId: z.uuid(),
  teamId: z.uuid().optional(),
});

/** Drops the current membership so the player goes back to the unassigned pool. */
export async function unassignPlayer(
  _previous: UnassignPlayerState,
  formData: FormData,
): Promise<UnassignPlayerState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    playerId: formData.get("playerId"),
    teamId: formData.get("teamId") || undefined,
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, playerId, teamId } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("team_memberships")
    .delete()
    .eq("tournament_id", tournamentId)
    .eq("player_id", playerId)
    .is("left_on", null);

  if (error) {
    logger.error("unassign_player_failed", { playerId, error });
    return fail("save_failed");
  }
  revalidatePath(adminTournamentPath(tournamentId));
  if (teamId) revalidatePath(adminTeamPath(tournamentId, teamId));
  return ok({ savedAt: Date.now() });
}
