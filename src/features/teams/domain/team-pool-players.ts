import type { KeeperMode } from "@/config/tournament-rules";
import type { PlayerSummary } from "@/features/players";

/** Players you can put on a team. Shared mode still allows a fixed GK on a squad. */
export function teamPoolPlayers(
  unassigned: readonly PlayerSummary[],
  _keeperMode: KeeperMode,
): PlayerSummary[] {
  return [...unassigned];
}
