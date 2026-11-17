import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import type { Database } from "@/types/database";

import { toKickoffTime } from "../schemas/fixture-input-schema";
import { ensureGameDay } from "./ensure-game-day";
import { kickoffSlotTaken } from "./kickoff-slot-taken";

type Client = SupabaseClient<Database>;

/** Park with no date, or move onto a free date + kick-off. */
export async function applyPostpone(
  supabase: Client,
  input: {
    tournamentId: string;
    fixtureId: string;
    playedOn: string | null;
    kickoffRaw: string | null;
  },
): Promise<ActionResult<{ savedAt: number }>> {
  const { tournamentId, fixtureId, playedOn, kickoffRaw } = input;
  if (!playedOn) return parkFixture(supabase, fixtureId);
  if (!kickoffRaw) return fail("invalid_input");
  return rescheduleFixture(supabase, {
    tournamentId,
    fixtureId,
    playedOn,
    kickoffRaw,
  });
}

async function parkFixture(
  supabase: Client,
  fixtureId: string,
): Promise<ActionResult<{ savedAt: number }>> {
  const { data, error } = await supabase
    .from("fixtures")
    .update({ status: "postponed" })
    .eq("id", fixtureId)
    .eq("status", "published")
    .select("id");
  if (error) {
    logger.error("postpone_fixture_failed", { fixtureId, error });
    return fail("save_failed");
  }
  if (!data.length) return fail("not_found");
  return ok({ savedAt: Date.now() });
}

async function rescheduleFixture(
  supabase: Client,
  input: {
    tournamentId: string;
    fixtureId: string;
    playedOn: string;
    kickoffRaw: string;
  },
): Promise<ActionResult<{ savedAt: number }>> {
  const gameDayId = await ensureGameDay(supabase, input.tournamentId, input.playedOn);
  if (!gameDayId) return fail("save_failed");
  if (
    await kickoffSlotTaken(supabase, {
      tournamentId: input.tournamentId,
      gameDayId,
      kickoffTime: input.kickoffRaw,
      excludeFixtureId: input.fixtureId,
    })
  ) {
    return fail("conflict");
  }
  const { data, error } = await supabase
    .from("fixtures")
    .update({
      status: "published",
      game_day_id: gameDayId,
      kickoff_time: toKickoffTime(input.kickoffRaw),
    })
    .eq("id", input.fixtureId)
    .eq("status", "published")
    .select("id");
  if (error) {
    logger.error("postpone_reschedule_failed", { fixtureId: input.fixtureId, error });
    return fail("save_failed");
  }
  if (!data.length) return fail("not_found");
  return ok({ savedAt: Date.now() });
}
