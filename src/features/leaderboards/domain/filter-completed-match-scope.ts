/**
 * Stats / Apps only count published results.
 * Opening match entry seeds squads as "played" before publish — those must not inflate Apps.
 * Walkovers are table-only (DECISIONS): no appearances or match events.
 */
export function filterCompletedMatchScope<
  P extends { fixture_id: string },
  E extends { fixture_id: string },
  F extends { id: string; status: string },
>(args: {
  participations: readonly P[];
  events: readonly E[];
  fixtures: readonly F[];
}): { participations: P[]; events: E[]; fixtures: F[] } {
  const fixtures = args.fixtures.filter((fixture) => fixture.status === "completed");
  const ids = new Set(fixtures.map((fixture) => fixture.id));
  return {
    fixtures,
    participations: args.participations.filter((row) => ids.has(row.fixture_id)),
    events: args.events.filter((row) => ids.has(row.fixture_id)),
  };
}
