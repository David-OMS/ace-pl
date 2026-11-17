import { orderWithoutBackToBack, type OrderedPair } from "./order-without-back-to-back";
import { packFixturesIntoDays } from "./pack-fixtures-into-days";

export type GenerateTeam = { id: string };
export type GenerateGameDay = { id: string };
export type ExistingGeneratedFixture = {
  gameDayId: string;
  homeTeamId: string;
  awayTeamId: string;
  kickoffTime: string;
};

export type GeneratedFixture = {
  gameDayId: string;
  homeTeamId: string;
  awayTeamId: string;
  kickoffTime: string;
};

type GenerateRoundRobinInput = {
  teams: readonly GenerateTeam[];
  gameDays: readonly GenerateGameDay[];
  matchesPerGameDay: number;
  firstKickoff: string;
  gapMinutes: number;
  existing?: readonly ExistingGeneratedFixture[];
};

/**
 * Double round-robin. Same-day sit-outs meet an early/rested side, not the last kick-off.
 * New day: sit-outs open; any opponent is fine for rest.
 */
export function generateRoundRobinFixtures(input: GenerateRoundRobinInput): GeneratedFixture[] {
  const { teams, gameDays, matchesPerGameDay, firstKickoff, gapMinutes } = input;
  const existing = input.existing ?? [];
  if (teams.length < 2 || gameDays.length === 0 || matchesPerGameDay < 1) return [];

  const taken = new Set(existing.map((row) => pairKey(row.homeTeamId, row.awayTeamId)));
  const pairs = buildDoubleRoundRobin(teams.map((t) => t.id)).filter(
    (pair) => !taken.has(pairKey(pair.homeTeamId, pair.awayTeamId)),
  );
  if (pairs.length === 0) return [];

  const byDay = packFixturesIntoDays({
    pairs,
    gameDays,
    matchesPerGameDay,
    existing,
  });
  const startMinutes = parseKickoffMinutes(firstKickoff);
  const lastKickoff = lastKickoffByDay(existing);
  const lastPair = lastPairByDay(existing);

  return byDay.flatMap(({ gameDayId, matches }) => {
    const ordered = orderWithoutBackToBack(matches, lastPair.get(gameDayId) ?? null);
    const dayStart = nextKickoffMinutes(lastKickoff.get(gameDayId), startMinutes, gapMinutes);
    return ordered.map((match, index) => ({
      gameDayId,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      kickoffTime: formatKickoffMinutes(dayStart + index * gapMinutes),
    }));
  });
}

function pairKey(homeTeamId: string, awayTeamId: string): string {
  return `${homeTeamId}:${awayTeamId}`;
}

function lastKickoffByDay(existing: readonly ExistingGeneratedFixture[]): Map<string, number> {
  const last = new Map<string, number>();
  for (const row of existing) {
    const minutes = parseKickoffMinutes(row.kickoffTime.slice(0, 5));
    const prev = last.get(row.gameDayId);
    if (prev === undefined || minutes > prev) last.set(row.gameDayId, minutes);
  }
  return last;
}

function lastPairByDay(existing: readonly ExistingGeneratedFixture[]): Map<string, OrderedPair> {
  const last = new Map<string, { pair: OrderedPair; minutes: number }>();
  for (const row of existing) {
    const minutes = parseKickoffMinutes(row.kickoffTime.slice(0, 5));
    const prev = last.get(row.gameDayId);
    if (prev && minutes <= prev.minutes) continue;
    last.set(row.gameDayId, {
      minutes,
      pair: { homeTeamId: row.homeTeamId, awayTeamId: row.awayTeamId },
    });
  }
  return new Map([...last].map(([id, value]) => [id, value.pair]));
}

function nextKickoffMinutes(
  lastOnDay: number | undefined,
  firstKickoff: number,
  gapMinutes: number,
): number {
  if (lastOnDay === undefined) return firstKickoff;
  return lastOnDay + gapMinutes;
}

function buildDoubleRoundRobin(teamIds: readonly string[]): OrderedPair[] {
  const first: OrderedPair[] = [];
  for (let i = 0; i < teamIds.length; i += 1) {
    for (let j = i + 1; j < teamIds.length; j += 1) {
      const home = teamIds[i];
      const away = teamIds[j];
      if (!home || !away) continue;
      first.push({ homeTeamId: home, awayTeamId: away });
    }
  }
  return first.concat(
    first.map((pair) => ({ homeTeamId: pair.awayTeamId, awayTeamId: pair.homeTeamId })),
  );
}

function parseKickoffMinutes(value: string): number {
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function formatKickoffMinutes(total: number): string {
  const hours = Math.floor(total / 60) % 24;
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}
