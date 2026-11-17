import "server-only";

import type { PlayerPosition } from "@/config/player-positions";
import { logger } from "@/lib/logger";

import type { PlayerDayPoints } from "../domain/score-fantasy-gameweek-team";
import { scoreFantasyGameweekTeam } from "../domain/score-fantasy-gameweek-team";
import { ensureGameweekSnapshot } from "./ensure-gameweek-snapshot";
import { fantasyScoringDb } from "./fantasy-scoring-db";
import { persistGameweekScores } from "./persist-gameweek-scores";

export async function scoreOneFantasyTeam(args: {
  teamId: string;
  formation: string;
  gameDayId: string;
  dayPoints: readonly PlayerDayPoints[];
}): Promise<void> {
  const snapped = await ensureGameweekSnapshot({
    teamId: args.teamId,
    gameDayId: args.gameDayId,
    formation: args.formation,
  });
  if (snapped !== "ok") return;

  const supabase = fantasyScoringDb();
  const { data: snapPicks, error: snapError } = await supabase
    .from("fantasy_gameweek_picks")
    .select("player_id, slot, is_bench, is_captain, is_vice, players!inner(position)")
    .eq("team_id", args.teamId)
    .eq("game_day_id", args.gameDayId);
  if (snapError) {
    logger.error("fantasy_recalc_snap_failed", { error: snapError });
    return;
  }

  const scored = scoreFantasyGameweekTeam(
    (snapPicks ?? []).map((pick) => ({
      playerId: pick.player_id,
      position: pick.players.position as PlayerPosition,
      isBench: pick.is_bench,
      isCaptain: pick.is_captain,
      isVice: pick.is_vice,
      slot: pick.slot,
    })),
    args.dayPoints,
  );

  await persistGameweekScores({
    teamId: args.teamId,
    gameDayId: args.gameDayId,
    scored,
  });
}
