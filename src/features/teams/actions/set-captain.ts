"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { adminTeamPath, adminTournamentPath } from "@/features/tournaments";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type SetCaptainState = ActionResult<{ savedAt: number }> | null;

const setCaptainSchema = z.object({
  tournamentId: z.uuid(),
  teamId: z.uuid(),
  playerId: z.uuid(),
});

export async function setCaptain(
  _previous: SetCaptainState,
  formData: FormData,
): Promise<SetCaptainState> {
  const parsed = setCaptainSchema.safeParse({
    tournamentId: formData.get("tournamentId"),
    teamId: formData.get("teamId"),
    playerId: formData.get("playerId"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, teamId, playerId } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("set_team_captain", {
    target_team_id: teamId,
    target_player_id: playerId,
  });

  if (error?.message === "not_in_team") return fail("not_found");
  if (error) {
    logger.error("set_captain_failed", { teamId, playerId, error });
    return fail("save_failed");
  }
  revalidatePath(adminTournamentPath(tournamentId));
  revalidatePath(adminTeamPath(tournamentId, teamId));
  return ok({ savedAt: Date.now() });
}
