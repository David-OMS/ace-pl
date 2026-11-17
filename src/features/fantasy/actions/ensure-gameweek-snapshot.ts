import "server-only";

import { logger } from "@/lib/logger";

import { fantasyScoringDb } from "./fantasy-scoring-db";
import { insertGameweekSnapshotPicks } from "./insert-gameweek-snapshot-picks";

/** Copy live picks once per team/GW. Later transfers do not rewrite the snapshot. */
export async function ensureGameweekSnapshot(args: {
  teamId: string;
  gameDayId: string;
  formation: string;
}): Promise<"ok" | "failed"> {
  const supabase = fantasyScoringDb();
  const { data: existing, error: existingError } = await supabase
    .from("fantasy_team_gameweeks")
    .select("team_id")
    .eq("team_id", args.teamId)
    .eq("game_day_id", args.gameDayId)
    .maybeSingle();
  if (existingError) {
    logger.error("fantasy_gw_snapshot_lookup_failed", { error: existingError });
    return "failed";
  }
  if (existing) return "ok";

  const { data: picks, error: picksError } = await supabase
    .from("fantasy_picks")
    .select("player_id, slot, is_bench, is_captain, is_vice")
    .eq("team_id", args.teamId)
    .order("slot");
  if (picksError) {
    logger.error("fantasy_gw_live_picks_failed", { error: picksError });
    return "failed";
  }

  const { error: gwError } = await supabase.from("fantasy_team_gameweeks").insert({
    team_id: args.teamId,
    game_day_id: args.gameDayId,
    formation: args.formation,
    points: 0,
  });
  if (gwError) {
    logger.error("fantasy_gw_insert_failed", { error: gwError });
    return "failed";
  }

  return insertGameweekSnapshotPicks({
    teamId: args.teamId,
    gameDayId: args.gameDayId,
    picks: picks ?? [],
  });
}
