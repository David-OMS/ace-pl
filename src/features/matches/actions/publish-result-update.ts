"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ADMIN_HOME_PATH } from "@/features/admin";
import { checkAdminAccess } from "@/features/auth";
import {
  FANTASY_LEADERBOARD_PATH,
  FANTASY_PATH,
  FANTASY_TRANSFERS_PATH,
  recalculateFantasyGameweek,
} from "@/features/fantasy";
import { adminFixturePath } from "@/features/fixtures";
import { adminTournamentFixturesPath, adminTournamentPath } from "@/features/tournaments";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { revalidateFanPublic } from "@/lib/cache/fan-public-cache";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type PublishResultUpdateState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  tournamentId: z.uuid(),
  fixtureId: z.uuid(),
});

/** Apply edits on an already-published result: fantasy + fan caches. */
export async function publishResultUpdate(
  _previous: PublishResultUpdateState,
  formData: FormData,
): Promise<PublishResultUpdateState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    fixtureId: formData.get("fixtureId"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, fixtureId } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { data: fixture, error } = await supabase
    .from("fixtures")
    .select("id, status")
    .eq("id", fixtureId)
    .maybeSingle();

  if (error) {
    logger.error("publish_result_update_load_failed", { fixtureId, error });
    return fail("save_failed");
  }
  if (!fixture) return fail("not_found");
  if (fixture.status !== "completed") return fail("forbidden");

  await recalculateFantasyGameweek(fixtureId);
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
