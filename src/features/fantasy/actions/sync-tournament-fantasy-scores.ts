import "server-only";

import { fantasyScoringDb } from "./fantasy-scoring-db";
import { recalculateFantasyGameDay } from "./recalculate-fantasy-game-day";

const DONE = ["completed", "walkover"] as const;

/** Persist current event maths into GW snapshots + season totals. */
export async function syncTournamentFantasyScores(tournamentId: string): Promise<void> {
  const supabase = fantasyScoringDb();
  const { data: fixtures, error } = await supabase
    .from("fixtures")
    .select("game_day_id")
    .eq("tournament_id", tournamentId)
    .in("status", [...DONE])
    .not("game_day_id", "is", null);
  if (error) throw error;

  const dayIds = [
    ...new Set(
      (fixtures ?? []).map((row) => row.game_day_id).filter((id): id is string => id !== null),
    ),
  ];
  for (const gameDayId of dayIds) {
    await recalculateFantasyGameDay(gameDayId);
  }
}
