import type { FixtureStatus } from "@/config/fixture-status";

const FINISHED: ReadonlySet<FixtureStatus> = new Set(["completed", "walkover", "void"]);

/** Match no longer blocks the transfer window (result in, or voided). */
export function fixtureFinishedForTransfers(status: FixtureStatus): boolean {
  return FINISHED.has(status);
}

export function gameDayFixturesFinished(fixtures: readonly { status: FixtureStatus }[]): boolean {
  if (fixtures.length === 0) return true;
  return fixtures.every((row) => fixtureFinishedForTransfers(row.status));
}
