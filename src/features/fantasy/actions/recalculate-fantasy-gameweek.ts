import "server-only";

import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { recalculateFantasyGameDay } from "./recalculate-fantasy-game-day";

/** Snapshot + score every fantasy team for the fixture's game day. */
export async function recalculateFantasyGameweek(fixtureId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: fixture, error: fixtureError } = await supabase
    .from("fixtures")
    .select("id, game_day_id")
    .eq("id", fixtureId)
    .maybeSingle();
  if (fixtureError || !fixture?.game_day_id) {
    logger.error("fantasy_recalc_fixture_failed", {
      fixtureId,
      error: fixtureError,
    });
    return;
  }

  await recalculateFantasyGameDay(fixture.game_day_id);
}
