"use server";

import { revalidatePath } from "next/cache";

import { revalidateFanPublic } from "@/lib/cache/fan-public-cache";
import { z } from "zod";

import { FIXTURE_SCHEDULE } from "@/config/fixture-schedule";
import { ADMIN_HOME_PATH } from "@/features/admin";
import { checkAdminAccess } from "@/features/auth";
import { adminTournamentFixturesPath, adminTournamentPath } from "@/features/tournaments";
import { syncTournamentStatus } from "@/features/tournaments/server";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { generateRoundRobinFixtures } from "../domain/generate-round-robin";
import { loadGenerateFixtureContext } from "./load-generate-fixture-context";

export type GenerateFixturesState = ActionResult<{ created: number }> | null;

const schema = z.object({ tournamentId: z.uuid() });

export async function generateFixtures(
  _previous: GenerateFixturesState,
  formData: FormData,
): Promise<GenerateFixturesState> {
  const parsed = schema.safeParse({ tournamentId: formData.get("tournamentId") });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId } = parsed.data;
  try {
    const context = await loadGenerateFixtureContext(tournamentId);
    if (!context) return fail("not_found");
    if (context.teams.length < 2 || context.gameDays.length === 0) return fail("invalid_input");

    const rows = generateRoundRobinFixtures({
      teams: context.teams,
      gameDays: context.gameDays,
      matchesPerGameDay: context.matchesPerGameDay,
      firstKickoff: FIXTURE_SCHEDULE.firstKickoff,
      gapMinutes: FIXTURE_SCHEDULE.gapMinutes,
      existing: context.existing,
    });
    if (rows.length === 0) return fail("conflict");

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("fixtures").insert(
      rows.map((row) => ({
        tournament_id: tournamentId,
        game_day_id: row.gameDayId,
        home_team_id: row.homeTeamId,
        away_team_id: row.awayTeamId,
        kickoff_time: row.kickoffTime,
        status: "published" as const,
      })),
    );
    if (error) {
      logger.error("generate_fixtures_insert_failed", { tournamentId, error });
      return fail("save_failed");
    }

    await syncTournamentStatus(supabase, tournamentId);
    revalidatePath(adminTournamentPath(tournamentId));
    revalidatePath(adminTournamentFixturesPath(tournamentId));
    revalidatePath(ADMIN_HOME_PATH);
    revalidateFanPublic();
    return ok({ created: rows.length });
  } catch (error) {
    logger.error("generate_fixtures_failed", { tournamentId, error });
    return fail("save_failed");
  }
}
