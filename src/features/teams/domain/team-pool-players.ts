import type { KeeperMode } from "@/config/tournament-rules";
import type { PlayerSummary } from "@/features/players";

/** Players you can put on a team right now. Shared mode keeps GKs out of squads. */
export function teamPoolPlayers(
  unassigned: readonly PlayerSummary[],
  keeperMode: KeeperMode,
): PlayerSummary[] {
  if (keeperMode !== "shared") return [...unassigned];
  return unassigned.filter((player) => player.position !== "GK");
}
