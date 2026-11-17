import type { FixtureStatus } from "@/config/fixture-status";

import {
  groupFixturesByGameDay,
  type FixtureGameDayGroup,
  type GameDayHeading,
} from "./group-fixtures-by-game-day";

export type BoardFixture = {
  id: string;
  gameDayId: string;
  kickoffTime: string;
  status: FixtureStatus;
};

/** Dated groups exclude postponed matches; those sit in undated until a date is set. */
export function partitionFixtureBoard<T extends BoardFixture>(
  gameDays: readonly GameDayHeading[],
  fixtures: readonly T[],
): { dated: FixtureGameDayGroup<T>[]; undated: T[] } {
  const postponed = fixtures.filter((fixture) => fixture.status === "postponed");
  const scheduled = fixtures.filter((fixture) => fixture.status !== "postponed");
  return {
    dated: groupFixturesByGameDay(gameDays, scheduled),
    undated: postponed,
  };
}
