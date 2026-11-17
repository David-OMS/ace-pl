import "server-only";

import { logger } from "@/lib/logger";

import { fantasyScoringDb } from "./fantasy-scoring-db";

type LivePick = {
  player_id: string;
  slot: number;
  is_bench: boolean;
  is_captain: boolean;
  is_vice: boolean;
};

export async function insertGameweekSnapshotPicks(args: {
  teamId: string;
  gameDayId: string;
  picks: readonly LivePick[];
}): Promise<"ok" | "failed"> {
  if (args.picks.length === 0) return "ok";
  const supabase = fantasyScoringDb();
  const { error } = await supabase.from("fantasy_gameweek_picks").insert(
    args.picks.map((pick) => ({
      team_id: args.teamId,
      game_day_id: args.gameDayId,
      player_id: pick.player_id,
      slot: pick.slot,
      is_bench: pick.is_bench,
      is_captain: pick.is_captain,
      is_vice: pick.is_vice,
      raw_points: 0,
      applied_points: 0,
      in_xi: !pick.is_bench,
    })),
  );
  if (error) {
    logger.error("fantasy_gw_picks_insert_failed", { error });
    return "failed";
  }
  return "ok";
}
