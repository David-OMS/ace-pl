import type { PlayerPosition } from "@/config/player-positions";
import { FANTASY_SCORING } from "@/config/fantasy-scoring";
import type { PlayerStatTotals } from "@/features/leaderboards";

type FantasyInput = Pick<
  PlayerStatTotals,
  | "apps"
  | "goals"
  | "assists"
  | "cleanSheets"
  | "yellowCards"
  | "redCards"
  | "saves"
  | "motm"
  | "ownGoals"
  | "penaltySaves"
> & { goalsConceded: number };

/** Tournament stats score from aggregated totals (no captaincy). */
export function calculatePlayerFantasyPoints(
  position: PlayerPosition,
  stats: FantasyInput,
): number {
  const table = FANTASY_SCORING;
  const saveBlocks = Math.floor(stats.saves / table.savesPerPoint);
  const concededBlocks = Math.floor(stats.goalsConceded / table.concededPairSize);

  return (
    stats.apps * table.appearance[position] +
    stats.goals * table.goal[position] +
    stats.assists * table.assist[position] +
    stats.cleanSheets * table.cleanSheet[position] +
    saveBlocks * table.savePoint[position] +
    stats.penaltySaves * table.penaltySave[position] +
    concededBlocks * table.concededPairPenalty[position] +
    stats.motm * table.motm[position] +
    stats.yellowCards * table.yellowCard[position] +
    stats.redCards * table.redCard[position] +
    stats.ownGoals * table.ownGoal[position]
  );
}
