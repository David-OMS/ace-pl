export type OrderedPair = { homeTeamId: string; awayTeamId: string };

type PickNextArgs = {
  remaining: readonly OrderedPair[];
  lastHome: string;
  lastAway: string;
  ordered: readonly OrderedPair[];
};

/**
 * Prefer a match that doesn't reuse either team from the previous slot.
 * `previous` seeds the last slot (e.g. when filling after fixtures already on that day).
 */
export function orderWithoutBackToBack(
  matches: readonly OrderedPair[],
  previous: OrderedPair | null = null,
): OrderedPair[] {
  const remaining = [...matches];
  const ordered: OrderedPair[] = [];
  let lastHome = previous?.homeTeamId ?? "";
  let lastAway = previous?.awayTeamId ?? "";

  while (remaining.length > 0) {
    const pickIndex = pickNextIndex({ remaining, lastHome, lastAway, ordered });
    const [picked] = remaining.splice(pickIndex, 1);
    if (!picked) break;
    ordered.push(picked);
    lastHome = picked.homeTeamId;
    lastAway = picked.awayTeamId;
  }
  return ordered;
}

function pickNextIndex({ remaining, lastHome, lastAway, ordered }: PickNextArgs): number {
  const gamesSoFar = countGames(ordered);
  const rested = remaining
    .map((match, index) => ({ match, index }))
    .filter(({ match }) => isRested(match, lastHome, lastAway));
  const pool = rested.length > 0 ? rested : remaining.map((match, index) => ({ match, index }));
  return pool.reduce(
    (best, candidate) =>
      pairLoad(candidate.match, gamesSoFar) < best.score
        ? { index: candidate.index, score: pairLoad(candidate.match, gamesSoFar) }
        : best,
    { index: pool[0]?.index ?? 0, score: Number.POSITIVE_INFINITY },
  ).index;
}

function isRested(match: OrderedPair, lastHome: string, lastAway: string): boolean {
  return (
    match.homeTeamId !== lastHome &&
    match.homeTeamId !== lastAway &&
    match.awayTeamId !== lastHome &&
    match.awayTeamId !== lastAway
  );
}

function pairLoad(match: OrderedPair, games: ReadonlyMap<string, number>): number {
  return (games.get(match.homeTeamId) ?? 0) + (games.get(match.awayTeamId) ?? 0);
}

function countGames(ordered: readonly OrderedPair[]): Map<string, number> {
  const games = new Map<string, number>();
  ordered.forEach((match) => {
    games.set(match.homeTeamId, (games.get(match.homeTeamId) ?? 0) + 1);
    games.set(match.awayTeamId, (games.get(match.awayTeamId) ?? 0) + 1);
  });
  return games;
}
