import type { PlayerPosition } from "@/config/player-positions";
import type { KeeperMode } from "@/config/tournament-rules";

type BorrowCandidate = { id: string; name: string; position: PlayerPosition };

type BorrowPoolForTeamInput = {
  pool: readonly BorrowCandidate[];
  teamHasGoalkeeper: boolean;
  sharedKeeperIds: readonly string[];
  keeperMode: KeeperMode;
};

/**
 * Shared keepers are only for sides that do not already have a fixed GK.
 * Per-team mode leaves the borrow list alone.
 */
export function borrowPoolForTeam({
  pool,
  teamHasGoalkeeper,
  sharedKeeperIds,
  keeperMode,
}: BorrowPoolForTeamInput): BorrowCandidate[] {
  if (keeperMode !== "shared" || !teamHasGoalkeeper) return [...pool];
  const blocked = new Set(sharedKeeperIds);
  return pool.filter((player) => !blocked.has(player.id));
}

export function teamHasGoalkeeper(players: readonly { isGoalkeeper: boolean }[]): boolean {
  return players.some((player) => player.isGoalkeeper);
}
