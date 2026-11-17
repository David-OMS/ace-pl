"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { adminTournamentPath } from "@/features/tournaments";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type AssignPlayerState = ActionResult<{ savedAt: number }> | null;

const assignSchema = z.object({
  tournamentId: z.uuid(),
  playerId: z.uuid(),
  teamId: z.uuid(),
});

export async function assignPlayer(
  _previous: AssignPlayerState,
  formData: FormData,
): Promise<AssignPlayerState> {
  const parsed = assignSchema.safeParse({
    tournamentId: formData.get("tournamentId"),
    playerId: formData.get("playerId"),
    teamId: formData.get("teamId"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, playerId, teamId } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const roster = await supabase
    .from("tournament_players")
    .select("player_id")
    .eq("tournament_id", tournamentId)
    .eq("player_id", playerId)
    .maybeSingle();
  if (roster.error) {
    logger.error("assign_player_roster_check_failed", { playerId, error: roster.error });
    return fail("save_failed");
  }
  if (!roster.data) return fail("invalid_input");

  const { error } = await supabase.rpc("assign_player_to_team", {
    target_player_id: playerId,
    target_team_id: teamId,
  });

  if (error) {
    logger.error("assign_player_failed", { playerId, teamId, error });
    return fail("save_failed");
  }
  revalidatePath(adminTournamentPath(tournamentId));
  return ok({ savedAt: Date.now() });
}
