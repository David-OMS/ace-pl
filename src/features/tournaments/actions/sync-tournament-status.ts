import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logger";
import type { Database } from "@/types/database";

import { deriveTournamentStatus } from "../domain/derive-tournament-status";
import { loadRosterPlayerIds } from "../queries/load-roster-player-ids";

type Client = SupabaseClient<Database>;

const FINISHED = new Set(["completed", "walkover", "void"]);

/** Writes setup / active / completed from roster, teams and fixture results. */
export async function syncTournamentStatus(supabase: Client, tournamentId: string): Promise<void> {
  const [rosterPlayerIds, teams, fixtures] = await Promise.all([
    loadRosterPlayerIds(supabase, tournamentId),
    supabase
      .from("teams")
      .select("id", { count: "exact", head: true })
      .eq("tournament_id", tournamentId),
    supabase.from("fixtures").select("status").eq("tournament_id", tournamentId),
  ]);

  if (teams.error || fixtures.error) {
    logger.error("sync_tournament_status_load_failed", {
      tournamentId,
      error: teams.error ?? fixtures.error,
    });
    return;
  }

  const rows = fixtures.data ?? [];
  const next = deriveTournamentStatus({
    hasRoster: rosterPlayerIds.length > 0,
    teamCount: teams.count ?? 0,
    fixtureCount: rows.length,
    openFixtureCount: rows.filter((row) => !FINISHED.has(row.status)).length,
  });

  const { error } = await supabase
    .from("tournaments")
    .update({ status: next })
    .eq("id", tournamentId)
    .neq("status", next);
  if (error) logger.error("sync_tournament_status_failed", { tournamentId, error });
}
