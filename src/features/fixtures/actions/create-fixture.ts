"use server";

import { revalidatePath } from "next/cache";

import { revalidateFanPublic } from "@/lib/cache/fan-public-cache";

import { ADMIN_HOME_PATH } from "@/features/admin";
import { checkAdminAccess } from "@/features/auth";
import { adminTournamentFixturesPath, adminTournamentPath } from "@/features/tournaments";
import { syncTournamentStatus } from "@/features/tournaments/server";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import {
  readFixtureForm,
  toKickoffTime,
  fixtureInputSchema,
} from "../schemas/fixture-input-schema";

export type CreateFixtureState = ActionResult<{ savedAt: number }> | null;

export async function createFixture(
  _previous: CreateFixtureState,
  formData: FormData,
): Promise<CreateFixtureState> {
  const parsed = fixtureInputSchema.safeParse(readFixtureForm(formData));
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, gameDayId, homeTeamId, awayTeamId, kickoffTime } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("fixtures").insert({
    tournament_id: tournamentId,
    game_day_id: gameDayId,
    home_team_id: homeTeamId,
    away_team_id: awayTeamId,
    kickoff_time: toKickoffTime(kickoffTime),
    status: "published",
  });

  if (error) {
    logger.error("create_fixture_failed", { tournamentId, error });
    return fail("save_failed");
  }
  await syncTournamentStatus(supabase, tournamentId);
  revalidatePath(adminTournamentPath(tournamentId));
  revalidatePath(adminTournamentFixturesPath(tournamentId));
  revalidatePath(ADMIN_HOME_PATH);
  revalidateFanPublic();
  return ok({ savedAt: Date.now() });
}
