"use server";

import { revalidatePath } from "next/cache";

import { revalidateFanPublic } from "@/lib/cache/fan-public-cache";
import { z } from "zod";

import { ADMIN_HOME_PATH } from "@/features/admin";
import { checkAdminAccess } from "@/features/auth";
import {
  countUnfinishedFixtures,
  FANTASY_LEADERBOARD_PATH,
  FANTASY_PATH,
  FANTASY_TRANSFERS_PATH,
  openTransferWindowIfComplete,
  recalculateFantasyGameweek,
} from "@/features/fantasy";
import { adminFixturePath } from "@/features/fixtures";
import { adminTournamentFixturesPath, adminTournamentPath } from "@/features/tournaments";
import { syncTournamentStatus } from "@/features/tournaments/server";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { loadFixtureGameDayId } from "./load-fixture-game-day";

export type PublishResultState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  tournamentId: z.uuid(),
  fixtureId: z.uuid(),
});

export async function publishResult(
  _previous: PublishResultState,
  formData: FormData,
): Promise<PublishResultState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    fixtureId: formData.get("fixtureId"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, fixtureId } = parsed.data;
  const gameDayId = await loadFixtureGameDayId(fixtureId);
  if (!gameDayId) return fail("save_failed");

  const unfinishedBefore = await countUnfinishedFixtures(gameDayId);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("fixtures")
    .update({ status: "completed", walkover_winner_team_id: null })
    .eq("id", fixtureId)
    .in("status", ["draft", "published"]);

  if (error) {
    logger.error("publish_result_failed", { fixtureId, error });
    return fail("save_failed");
  }
  await syncTournamentStatus(supabase, tournamentId);
  await recalculateFantasyGameweek(fixtureId);
  await openTransferWindowIfComplete({ gameDayId, tournamentId, unfinishedBefore });
  revalidatePath(adminFixturePath(tournamentId, fixtureId));
  revalidatePath(adminTournamentFixturesPath(tournamentId));
  revalidatePath(adminTournamentPath(tournamentId));
  revalidatePath(ADMIN_HOME_PATH);
  revalidatePath(FANTASY_PATH);
  revalidatePath(FANTASY_TRANSFERS_PATH);
  revalidatePath(FANTASY_LEADERBOARD_PATH);
  revalidateFanPublic();
  return ok({ savedAt: Date.now() });
}
