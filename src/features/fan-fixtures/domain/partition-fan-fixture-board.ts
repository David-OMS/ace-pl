import type { FixtureStatus } from "@/config/fixture-status";

import { isFixtureFinished } from "./is-fixture-finished";

type FixtureRow = { status: FixtureStatus };

export type FanFixtureGameDayGroup<T extends FixtureRow> = {
  gameDay: { id: string; playedOn: string; label: string; gameweek?: number };
  fixtures: T[];
};

export function findSelectedGroup<T extends FixtureRow>(
  groups: readonly FanFixtureGameDayGroup<T>[],
  selectedGameDayId: string | null,
): FanFixtureGameDayGroup<T> | null {
  if (!selectedGameDayId) return null;
  return groups.find((group) => group.gameDay.id === selectedGameDayId) ?? null;
}

/** Game days strictly before the selected date, newest first, with finished fixtures only. */
export function listPastGameDayGroups<T extends FixtureRow>(
  groups: readonly FanFixtureGameDayGroup<T>[],
  selectedPlayedOn: string | null,
): FanFixtureGameDayGroup<T>[] {
  if (!selectedPlayedOn) return [];

  return groups
    .filter((group) => group.gameDay.playedOn < selectedPlayedOn)
    .map((group) => ({
      gameDay: group.gameDay,
      fixtures: group.fixtures.filter((fixture) => isFixtureFinished(fixture.status)),
    }))
    .filter((group) => group.fixtures.length > 0)
    .sort((a, b) => b.gameDay.playedOn.localeCompare(a.gameDay.playedOn));
}

export function selectedDayHasOpenFixtures<T extends FixtureRow>(
  group: FanFixtureGameDayGroup<T> | null,
): boolean {
  if (!group) return false;
  return group.fixtures.some((fixture) => !isFixtureFinished(fixture.status));
}
