"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ADMIN_HOME_PATH } from "@/features/admin";
import { checkAdminAccess } from "@/features/auth";
import { adminTournamentFixturesPath } from "@/features/tournaments";
import { syncTournamentStatus } from "@/features/tournaments/server";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { adminFixturePath } from "../routes";
import { toKickoffTime } from "../schemas/fixture-input-schema";
import { ensureGameDay } from "./ensure-game-day";
import { kickoffSlotTaken } from "./kickoff-slot-taken";

export type SetFixtureDateState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  tournamentId: z.uuid(),
  fixtureId: z.uuid(),
  playedOn: z.iso.date(),
  kickoffTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
});

/** Puts a postponed match onto a free date + kick-off and schedules it again. */
export async function setFixtureDate(
  _previous: SetFixtureDateState,
  formData: FormData,
): Promise<SetFixtureDateState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    fixtureId: formData.get("fixtureId"),
    playedOn: formData.get("playedOn"),
    kickoffTime: formData.get("kickoffTime"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, fixtureId, playedOn, kickoffTime } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const gameDayId = await ensureGameDay(supabase, tournamentId, playedOn);
  if (!gameDayId) return fail("save_failed");

  if (
    await kickoffSlotTaken(supabase, {
      tournamentId,
      gameDayId,
      kickoffTime,
      excludeFixtureId: fixtureId,
    })
  ) {
    return fail("conflict");
  }

  const { data, error } = await supabase
    .from("fixtures")
    .update({
      status: "published",
      game_day_id: gameDayId,
      kickoff_time: toKickoffTime(kickoffTime),
    })
    .eq("id", fixtureId)
    .eq("status", "postponed")
    .select("id");

  if (error) {
    logger.error("set_fixture_date_failed", { fixtureId, error });
    return fail("save_failed");
  }
  if (!data.length) return fail("not_found");

  await syncTournamentStatus(supabase, tournamentId);
  revalidatePath(adminTournamentFixturesPath(tournamentId));
  revalidatePath(adminFixturePath(tournamentId, fixtureId));
  revalidatePath(ADMIN_HOME_PATH);
  return ok({ savedAt: Date.now() });
}
