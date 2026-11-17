import "server-only";

import { logger } from "@/lib/logger";

import { fantasyScoringDb } from "./fantasy-scoring-db";

/** Season total = Σ gameweek points − Σ transfer hits. */
export async function refreshFantasyTotalPoints(tournamentId: string): Promise<"ok" | "failed"> {
  const supabase = fantasyScoringDb();
  const { data: teams, error: teamsError } = await supabase
    .from("fantasy_teams")
    .select("id")
    .eq("tournament_id", tournamentId);
  if (teamsError) {
    logger.error("fantasy_total_teams_failed", { error: teamsError });
    return "failed";
  }

  for (const team of teams ?? []) {
    const [gw, transfers] = await Promise.all([
      supabase.from("fantasy_team_gameweeks").select("points").eq("team_id", team.id),
      supabase.from("fantasy_transfers").select("point_cost").eq("team_id", team.id),
    ]);
    if (gw.error || transfers.error) {
      logger.error("fantasy_total_sum_failed", {
        error: gw.error ?? transfers.error,
      });
      return "failed";
    }
    const gwSum = (gw.data ?? []).reduce((sum, row) => sum + row.points, 0);
    const hitSum = (transfers.data ?? []).reduce((sum, row) => sum + row.point_cost, 0);
    const { error: updateError } = await supabase
      .from("fantasy_teams")
      .update({ total_points: gwSum - hitSum })
      .eq("id", team.id);
    if (updateError) {
      logger.error("fantasy_total_update_failed", { error: updateError });
      return "failed";
    }
  }
  return "ok";
}
