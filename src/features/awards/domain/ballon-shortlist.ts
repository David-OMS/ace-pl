export type BallonCandidate = {
  playerId: string;
  name: string;
  statsScore: number;
};

const SHORTLIST_SIZE = 5;

/** Top N by stats score (fantasy scoring table, no captaincy). */
export function ballonShortlist(
  candidates: readonly BallonCandidate[],
  size = SHORTLIST_SIZE,
): BallonCandidate[] {
  return [...candidates]
    .filter((c) => c.statsScore > 0)
    .sort((a, b) => b.statsScore - a.statsScore || a.name.localeCompare(b.name))
    .slice(0, size);
}
