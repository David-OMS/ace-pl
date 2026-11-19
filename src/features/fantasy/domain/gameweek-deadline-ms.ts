import { FANTASY_DEADLINE_WEEKDAY } from "@/config/fantasy";

/** Thu 23:59:59 Africa/Lagos (UTC+1) before the given game day. */
export function gameweekDeadlineMs(playedOnIso: string): number {
  const parts = playedOnIso.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const gameNoonUtc = Date.UTC(y, m - 1, d, 11, 0, 0);
  const weekday = new Date(gameNoonUtc).getUTCDay();
  const daysBack = (weekday - FANTASY_DEADLINE_WEEKDAY + 7) % 7;
  const deadlineUtc = gameNoonUtc - daysBack * 24 * 60 * 60 * 1000;
  const deadlineDate = new Date(deadlineUtc);
  return Date.UTC(
    deadlineDate.getUTCFullYear(),
    deadlineDate.getUTCMonth(),
    deadlineDate.getUTCDate(),
    22,
    59,
    59,
    999,
  );
}

export function firstGameweekDeadlineMs(playedOnIso: string): number {
  return gameweekDeadlineMs(playedOnIso);
}
