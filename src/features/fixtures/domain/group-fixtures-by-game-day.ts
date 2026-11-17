export type FixtureRow = {
  id: string;
  gameDayId: string;
  kickoffTime: string;
};

export type GameDayHeading = {
  id: string;
  playedOn: string;
  label: string;
  gameweek?: number;
};

export type FixtureGameDayGroup<T extends FixtureRow> = {
  gameDay: GameDayHeading;
  fixtures: T[];
};

/** Groups fixtures under their game day, kick-off time ascending within each day. */
export function groupFixturesByGameDay<T extends FixtureRow>(
  gameDays: readonly GameDayHeading[],
  fixtures: readonly T[],
): FixtureGameDayGroup<T>[] {
  return gameDays.map((gameDay) => ({
    gameDay,
    fixtures: fixtures
      .filter((fixture) => fixture.gameDayId === gameDay.id)
      .sort((a, b) => a.kickoffTime.localeCompare(b.kickoffTime)),
  }));
}
