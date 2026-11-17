import type { PlayerPosition } from "@/config/player-positions";

export type AutoSubPick = {
  playerId: string;
  position: PlayerPosition;
  isBench: boolean;
  /** Bench order among bench players (lower = earlier). */
  benchOrder: number;
};

/**
 * Outfield starter who did not play → first bench outfielder who did.
 * GK never auto-subs.
 */
export function applyFantasyAutoSubs(
  picks: readonly AutoSubPick[],
  playedIds: ReadonlySet<string>,
): ReadonlySet<string> {
  const starters = picks.filter((p) => !p.isBench);
  const bench = picks
    .filter((p) => p.isBench)
    .slice()
    .sort((a, b) => a.benchOrder - b.benchOrder);

  const inXi = new Set(starters.map((p) => p.playerId));
  const usedBench = new Set<string>();

  for (const starter of starters) {
    if (starter.position === "GK") continue;
    if (playedIds.has(starter.playerId)) continue;

    const sub = bench.find(
      (b) => b.position !== "GK" && !usedBench.has(b.playerId) && playedIds.has(b.playerId),
    );
    if (!sub) continue;
    inXi.delete(starter.playerId);
    inXi.add(sub.playerId);
    usedBench.add(sub.playerId);
  }

  return inXi;
}
