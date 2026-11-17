import type { OrderedPair } from "./order-without-back-to-back";

export type PackGameDay = { id: string };
export type PackExisting = {
  gameDayId: string;
  homeTeamId: string;
  awayTeamId: string;
  kickoffTime: string;
};

type DayPackState = {
  gamesToday: Map<string, number>;
  firstPlaySlot: Map<string, number>;
  lastHome: string;
  lastAway: string;
  slot: number;
};

type PairScore = {
  maxToday: number;
  sumToday: number;
  maxTour: number;
  sumTour: number;
  restPenalty: number;
};

/** Assign remaining pairs to days with round fairness and same-day rest rules. */
export function packFixturesIntoDays(input: {
  pairs: readonly OrderedPair[];
  gameDays: readonly PackGameDay[];
  matchesPerGameDay: number;
  existing: readonly PackExisting[];
}): { gameDayId: string; matches: OrderedPair[] }[] {
  const { gameDays, matchesPerGameDay, existing } = input;
  const remaining = [...input.pairs];
  const occupied = countByDay(existing);
  const tournamentGames = countTournamentGames(existing);

  return gameDays.map((day) => {
    const state = dayStateFromExisting(day.id, existing);
    const matches: OrderedPair[] = [];
    const already = occupied.get(day.id) ?? 0;
    while (matches.length + already < matchesPerGameDay && remaining.length > 0) {
      const nextIndex = pickBalancedPair(remaining, state, tournamentGames);
      const picked = remaining[nextIndex];
      if (!picked) break;
      remaining.splice(nextIndex, 1);
      matches.push(picked);
      recordPick(state, tournamentGames, picked);
    }
    return { gameDayId: day.id, matches };
  });
}

function countByDay(existing: readonly PackExisting[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of existing) {
    counts.set(row.gameDayId, (counts.get(row.gameDayId) ?? 0) + 1);
  }
  return counts;
}

function countTournamentGames(existing: readonly PackExisting[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of existing) {
    counts.set(row.homeTeamId, (counts.get(row.homeTeamId) ?? 0) + 1);
    counts.set(row.awayTeamId, (counts.get(row.awayTeamId) ?? 0) + 1);
  }
  return counts;
}

function dayStateFromExisting(gameDayId: string, existing: readonly PackExisting[]): DayPackState {
  const onDay = existing
    .filter((row) => row.gameDayId === gameDayId)
    .sort((a, b) => a.kickoffTime.localeCompare(b.kickoffTime));
  const gamesToday = new Map<string, number>();
  const firstPlaySlot = new Map<string, number>();
  onDay.forEach((row, slot) => {
    gamesToday.set(row.homeTeamId, (gamesToday.get(row.homeTeamId) ?? 0) + 1);
    gamesToday.set(row.awayTeamId, (gamesToday.get(row.awayTeamId) ?? 0) + 1);
    if (!firstPlaySlot.has(row.homeTeamId)) firstPlaySlot.set(row.homeTeamId, slot);
    if (!firstPlaySlot.has(row.awayTeamId)) firstPlaySlot.set(row.awayTeamId, slot);
  });
  const last = onDay[onDay.length - 1];
  return {
    gamesToday,
    firstPlaySlot,
    lastHome: last?.homeTeamId ?? "",
    lastAway: last?.awayTeamId ?? "",
    slot: onDay.length,
  };
}

function recordPick(
  state: DayPackState,
  tournamentGames: Map<string, number>,
  picked: OrderedPair,
): void {
  const { homeTeamId, awayTeamId } = picked;
  state.gamesToday.set(homeTeamId, (state.gamesToday.get(homeTeamId) ?? 0) + 1);
  state.gamesToday.set(awayTeamId, (state.gamesToday.get(awayTeamId) ?? 0) + 1);
  tournamentGames.set(homeTeamId, (tournamentGames.get(homeTeamId) ?? 0) + 1);
  tournamentGames.set(awayTeamId, (tournamentGames.get(awayTeamId) ?? 0) + 1);
  if (!state.firstPlaySlot.has(homeTeamId)) state.firstPlaySlot.set(homeTeamId, state.slot);
  if (!state.firstPlaySlot.has(awayTeamId)) state.firstPlaySlot.set(awayTeamId, state.slot);
  state.lastHome = homeTeamId;
  state.lastAway = awayTeamId;
  state.slot += 1;
}

function pickBalancedPair(
  remaining: readonly OrderedPair[],
  state: DayPackState,
  tournamentGames: ReadonlyMap<string, number>,
): number {
  let bestIndex = 0;
  let best = pairScore(remaining[0] as OrderedPair, state, tournamentGames);
  for (let index = 1; index < remaining.length; index += 1) {
    const pair = remaining[index];
    if (!pair) continue;
    const score = pairScore(pair, state, tournamentGames);
    if (isBetterScore(score, best)) {
      best = score;
      bestIndex = index;
    }
  }
  return bestIndex;
}

function pairScore(
  pair: OrderedPair,
  state: DayPackState,
  tournamentGames: ReadonlyMap<string, number>,
): PairScore {
  const homeToday = state.gamesToday.get(pair.homeTeamId) ?? 0;
  const awayToday = state.gamesToday.get(pair.awayTeamId) ?? 0;
  return {
    maxToday: Math.max(homeToday, awayToday),
    sumToday: homeToday + awayToday,
    maxTour: Math.max(
      tournamentGames.get(pair.homeTeamId) ?? 0,
      tournamentGames.get(pair.awayTeamId) ?? 0,
    ),
    sumTour:
      (tournamentGames.get(pair.homeTeamId) ?? 0) + (tournamentGames.get(pair.awayTeamId) ?? 0),
    restPenalty: sameDayRestPenalty({ pair, homeToday, awayToday, state }),
  };
}

function isBetterScore(candidate: PairScore, best: PairScore): boolean {
  if (candidate.maxToday !== best.maxToday) return candidate.maxToday < best.maxToday;
  if (candidate.sumToday !== best.sumToday) return candidate.sumToday < best.sumToday;
  if (candidate.maxTour !== best.maxTour) return candidate.maxTour < best.maxTour;
  if (candidate.sumTour !== best.sumTour) return candidate.sumTour < best.sumTour;
  return candidate.restPenalty < best.restPenalty;
}

function sameDayRestPenalty(input: {
  pair: OrderedPair;
  homeToday: number;
  awayToday: number;
  state: DayPackState;
}): number {
  const { pair, homeToday, awayToday, state } = input;
  if (homeToday === 0 && awayToday === 0) return 0;
  if (homeToday === 0 || awayToday === 0) {
    return sitOutPartnerPenalty(homeToday === 0 ? pair.awayTeamId : pair.homeTeamId, state);
  }
  return reusedPairPenalty(pair, state);
}

function sitOutPartnerPenalty(partnerId: string, state: DayPackState): number {
  const firstSlot = state.firstPlaySlot.get(partnerId) ?? state.slot;
  return justPlayedPenalty(partnerId, state) + firstSlot;
}

function reusedPairPenalty(pair: OrderedPair, state: DayPackState): number {
  const homeSlot = state.firstPlaySlot.get(pair.homeTeamId) ?? state.slot;
  const awaySlot = state.firstPlaySlot.get(pair.awayTeamId) ?? state.slot;
  return (
    justPlayedPenalty(pair.homeTeamId, state) +
    justPlayedPenalty(pair.awayTeamId, state) +
    homeSlot +
    awaySlot
  );
}

function justPlayedPenalty(teamId: string, state: DayPackState): number {
  return teamId === state.lastHome || teamId === state.lastAway ? 1000 : 0;
}
