import "server-only";

import { logger } from "@/lib/logger";

import { loadGameDayPlayerPoints } from "../queries/load-game-day-player-points";
import { fantasyScoringDb } from "./fantasy-scoring-db";
import { refreshFantasyTotalPoints } from "./refresh-fantasy-total-points";
import { scoreOneFantasyTeam } from "./score-one-fantasy-team";

/** Re-score every fantasy team for one Friday. */
export async function recalculateFantasyGameDay(gameDayId: string): Promise<void> {
  const supabase = fantasyScoringDb();
  const { data: day, error: dayError } = await supabase
    .from("game_days")
    .select("id, tournament_id")
    .eq("id", gameDayId)
    .maybeSingle();
  if (dayError || !day) {
    logger.error("fantasy_recalc_day_failed", { gameDayId, error: dayError });
    return;
  }

  const { data: teams, error: teamsError } = await supabase
    .from("fantasy_teams")
    .select("id, formation")
    .eq("tournament_id", day.tournament_id);
  if (teamsError) {
    logger.error("fantasy_recalc_teams_failed", { error: teamsError });
    return;
  }

  const dayPoints = await loadGameDayPlayerPoints(gameDayId);
  for (const team of teams ?? []) {
    await scoreOneFantasyTeam({
      teamId: team.id,
      formation: team.formation,
      gameDayId,
      dayPoints,
    });
  }

  await refreshFantasyTotalPoints(day.tournament_id);
}
