"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import {
  FANTASY_LEADERBOARD_PATH,
  FANTASY_PATH,
  recalculateFantasyGameweek,
} from "@/features/fantasy";
import { adminFixturePath } from "@/features/fixtures";
import { adminTournamentPath } from "@/features/tournaments";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type RecordWalkoverState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  tournamentId: z.uuid(),
  fixtureId: z.uuid(),
  winnerTeamId: z.uuid(),
});

/** 3–0 in the table only — clears player events so stats stay empty. */
export async function recordWalkover(
  _previous: RecordWalkoverState,
  formData: FormData,
): Promise<RecordWalkoverState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    fixtureId: formData.get("fixtureId"),
    winnerTeamId: formData.get("winnerTeamId"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, fixtureId, winnerTeamId } = parsed.data;
  const supabase = await createSupabaseServerClient();

  const { error: clearError } = await supabase
    .from("match_events")
    .delete()
    .eq("fixture_id", fixtureId);
  if (clearError) {
    logger.error("walkover_clear_events_failed", { fixtureId, error: clearError });
    return fail("save_failed");
  }

  const { error } = await supabase
    .from("fixtures")
    .update({ status: "walkover", walkover_winner_team_id: winnerTeamId })
    .eq("id", fixtureId);

  if (error) {
    logger.error("record_walkover_failed", { fixtureId, error });
    return fail("save_failed");
  }
  await recalculateFantasyGameweek(fixtureId);
  revalidatePath(adminFixturePath(tournamentId, fixtureId));
  revalidatePath(adminTournamentPath(tournamentId));
  revalidatePath(FANTASY_PATH);
  revalidatePath(FANTASY_LEADERBOARD_PATH);
  return ok({ savedAt: Date.now() });
}
