import { FANTASY_UNLIMITED_THROUGH_GAMEWEEK } from "@/config/fantasy";
import type { FixtureStatus } from "@/config/fixture-status";

import { gameDayFixturesFinished } from "./fixture-finished-for-transfers";
import { gameweekDeadlineMs } from "./gameweek-deadline-ms";

export type TransferWindowMode = "unlimited" | "locked" | "open";

export type TransferWindowGameDay = {
  playedOn: string;
  fixtures: readonly { status: FixtureStatus }[];
};

/**
 * Unlimited until the configured GW deadline (default through GW2).
 * Mid-GW after that week's deadline: locked until fixtures finish.
 * After the unlimited period: open (1 free) between finished weeks.
 */
export function resolveTransferWindow(args: {
  nowMs: number;
  gameDays: readonly TransferWindowGameDay[];
}): TransferWindowMode {
  const days = [...args.gameDays].sort((a, b) => a.playedOn.localeCompare(b.playedOn));
  if (days.length === 0) return "unlimited";

  let active: TransferWindowGameDay | null = null;
  for (const day of days) {
    if (args.nowMs >= gameweekDeadlineMs(day.playedOn)) active = day;
    else break;
  }
  if (active && !gameDayFixturesFinished(active.fixtures)) return "locked";

  const unlimitedIndex = Math.max(0, FANTASY_UNLIMITED_THROUGH_GAMEWEEK - 1);
  const unlimitedUntil = days[unlimitedIndex] ?? days[days.length - 1];
  if (unlimitedUntil && args.nowMs < gameweekDeadlineMs(unlimitedUntil.playedOn)) {
    return "unlimited";
  }

  return "open";
}
