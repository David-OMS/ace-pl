import "server-only";

import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/**
 * Older seed marked everyone absent. If nothing has been edited yet, flip to played.
 */
export async function fixLegacyAbsentDefaults(fixtureId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const [{ data: rows, error: rowsError }, { count: eventCount, error: eventsError }] =
    await Promise.all([
      supabase.from("match_participations").select("id, status").eq("fixture_id", fixtureId),
      supabase
        .from("match_events")
        .select("id", { count: "exact", head: true })
        .eq("fixture_id", fixtureId),
    ]);

  if (rowsError || eventsError) {
    logger.error("fix_legacy_absent_failed", { error: rowsError ?? eventsError });
    return;
  }
  if (!rows?.length || (eventCount ?? 0) > 0) return;
  if (rows.some((row) => row.status !== "absent")) return;

  const { error } = await supabase
    .from("match_participations")
    .update({ status: "played" })
    .eq("fixture_id", fixtureId);
  if (error) logger.error("fix_legacy_absent_update_failed", { error });
}
