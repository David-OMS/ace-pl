import "server-only";

import { logger } from "@/lib/logger";

import type { ScoredGameweekTeam } from "../domain/score-fantasy-gameweek-team";
import { fantasyScoringDb } from "./fantasy-scoring-db";

export async function persistGameweekScores(args: {
  teamId: string;
  gameDayId: string;
  scored: ScoredGameweekTeam;
}): Promise<"ok" | "failed"> {
  const supabase = fantasyScoringDb();
  const { error: gwError } = await supabase
    .from("fantasy_team_gameweeks")
    .update({ points: args.scored.points })
    .eq("team_id", args.teamId)
    .eq("game_day_id", args.gameDayId);
  if (gwError) {
    logger.error("fantasy_gw_points_update_failed", { error: gwError });
    return "failed";
  }

  for (const pick of args.scored.picks) {
    const { error } = await supabase
      .from("fantasy_gameweek_picks")
      .update({
        raw_points: pick.rawPoints,
        applied_points: pick.appliedPoints,
        in_xi: pick.inXi,
      })
      .eq("team_id", args.teamId)
      .eq("game_day_id", args.gameDayId)
      .eq("player_id", pick.playerId);
    if (error) {
      logger.error("fantasy_gw_pick_score_failed", { error });
      return "failed";
    }
  }
  return "ok";
}
