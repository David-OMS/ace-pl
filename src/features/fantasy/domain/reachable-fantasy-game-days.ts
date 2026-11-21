import { gameweekDeadlineMs } from "./gameweek-deadline-ms";

export type ReachableGameDay = {
  id: string;
  playedOn: string;
};

/**
 * Gameweeks whose Thursday deadline has passed (or is now).
 * Future weeks are not browsable yet.
 */
export function reachableFantasyGameDays<T extends ReachableGameDay>(
  days: readonly T[],
  nowMs: number,
): T[] {
  return days.filter((day) => nowMs >= gameweekDeadlineMs(day.playedOn));
}

/** Latest reachable GW id — the "current" week for edit/actions. */
export function currentFantasyGameDayId(
  days: readonly ReachableGameDay[],
  nowMs: number,
): string | null {
  const reachable = reachableFantasyGameDays(days, nowMs);
  return reachable[reachable.length - 1]?.id ?? null;
}
