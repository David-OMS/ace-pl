import type { FixtureStatus } from "@/config/fixture-status";

import { gameDayFixturesFinished } from "./fixture-finished-for-transfers";
import { gameweekDeadlineMs } from "./gameweek-deadline-ms";

export type TransferWindowMode = "unlimited" | "locked" | "open";

export type TransferWindowGameDay = {
  playedOn: string;
  fixtures: readonly { status: FixtureStatus }[];
};

/**
 * Unlimited until the first GW Thursday deadline.
 * After a GW deadline: locked until every fixture that week is finished,
 * then open (1 free transfer) until the next deadline.
 */
export function resolveTransferWindow(args: {
  nowMs: number;
  gameDays: readonly TransferWindowGameDay[];
}): TransferWindowMode {
  const days = [...args.gameDays].sort((a, b) => a.playedOn.localeCompare(b.playedOn));
  if (days.length === 0) return "unlimited";

  const first = days[0];
  if (!first) return "unlimited";
  if (args.nowMs < gameweekDeadlineMs(first.playedOn)) return "unlimited";

  let active: TransferWindowGameDay | null = null;
  for (const day of days) {
    if (args.nowMs >= gameweekDeadlineMs(day.playedOn)) active = day;
    else break;
  }
  if (!active) return "unlimited";
  if (!gameDayFixturesFinished(active.fixtures)) return "locked";
  return "open";
}
