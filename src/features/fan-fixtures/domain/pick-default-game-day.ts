import type { FixtureStatus } from "@/config/fixture-status";

import { isFixtureFinished } from "./is-fixture-finished";

type DayGroup = {
  gameDay: { id: string; playedOn: string };
  fixtures: readonly { status: FixtureStatus }[];
};

/** Prefer the earliest day that still has open fixtures; else the latest day with matches. */
export function pickDefaultGameDayId(groups: readonly DayGroup[], todayIso: string): string | null {
  const withFixtures = groups.filter((group) => group.fixtures.length > 0);
  if (withFixtures.length === 0) return null;

  const open = withFixtures
    .filter(
      (group) =>
        group.gameDay.playedOn >= todayIso ||
        group.fixtures.some((fixture) => !isFixtureFinished(fixture.status)),
    )
    .sort((a, b) => a.gameDay.playedOn.localeCompare(b.gameDay.playedOn));

  const next = open[0];
  if (next) return next.gameDay.id;
  const last = withFixtures[withFixtures.length - 1];
  return last?.gameDay.id ?? null;
}
