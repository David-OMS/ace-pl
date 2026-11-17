import "server-only";

import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { fixLegacyAbsentDefaults } from "./fix-legacy-absent-defaults";
import { seedFixtureSquad } from "./seed-fixture-squad";

const LOCKED = new Set(["completed", "void", "walkover"]);

/** Seeds squad rows as played when the match has none yet. */
export async function ensureMatchSquads(fixtureId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: fixture, error: fixtureError } = await supabase
    .from("fixtures")
    .select("id, tournament_id, home_team_id, away_team_id, status")
    .eq("id", fixtureId)
    .maybeSingle();

  if (fixtureError || !fixture || LOCKED.has(fixture.status)) {
    if (fixtureError) logger.error("ensure_squads_fixture_failed", { error: fixtureError });
    return;
  }

  const { count, error: countError } = await supabase
    .from("match_participations")
    .select("id", { count: "exact", head: true })
    .eq("fixture_id", fixtureId);

  if (countError) {
    logger.error("ensure_squads_count_failed", { error: countError });
    return;
  }
  if ((count ?? 0) > 0) {
    await fixLegacyAbsentDefaults(fixtureId);
    return;
  }

  await seedFixtureSquad(fixture);
}
