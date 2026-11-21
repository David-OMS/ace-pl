import "server-only";

import { mapPool } from "@/lib/async/map-pool";
import { logger } from "@/lib/logger";

import { teamScoresGameweek } from "../domain/team-scores-gameweek";
import { loadGameDayPlayerPoints } from "../queries/load-game-day-player-points";
import { fantasyScoringDb } from "./fantasy-scoring-db";
import { refreshFantasyTotalPoints } from "./refresh-fantasy-total-points";
import { scoreOneFantasyTeam } from "./score-one-fantasy-team";

const SCORE_CONCURRENCY = 8;

/** Re-score every fantasy team for one Friday. */
export async function recalculateFantasyGameDay(gameDayId: string): Promise<void> {
  const supabase = fantasyScoringDb();
  const { data: day, error: dayError } = await supabase
    .from("game_days")
    .select("id, tournament_id, played_on")
    .eq("id", gameDayId)
    .maybeSingle();
  if (dayError || !day) {
    logger.error("fantasy_recalc_day_failed", { gameDayId, error: dayError });
    return;
  }

  const { data: teams, error: teamsError } = await supabase
    .from("fantasy_teams")
    .select("id, formation, created_at")
    .eq("tournament_id", day.tournament_id);
  if (teamsError) {
    logger.error("fantasy_recalc_teams_failed", { error: teamsError });
    return;
  }

  const dayPoints = await loadGameDayPlayerPoints(gameDayId);
  const eligible = (teams ?? []).filter((team) =>
    teamScoresGameweek({
      createdAtMs: Date.parse(team.created_at),
      playedOn: day.played_on,
    }),
  );

  await mapPool(eligible, SCORE_CONCURRENCY, async (team) => {
    await scoreOneFantasyTeam({
      teamId: team.id,
      formation: team.formation,
      gameDayId,
      dayPoints,
    });
  });

  await refreshFantasyTotalPoints(day.tournament_id);
}
