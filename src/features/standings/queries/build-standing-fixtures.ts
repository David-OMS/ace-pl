import { calculateMatchScore, resolveEventTeam } from "@/features/matches";

import type { StandingFixture } from "../domain/calculate-standings";

type FixtureRow = {
  id: string;
  home_team_id: string;
  away_team_id: string;
  status: string;
  walkover_winner_team_id: string | null;
};

type EventRow = {
  fixture_id: string;
  event_type: "goal" | "own_goal" | string;
  player_id: string;
};

type ParticipationRow = {
  fixture_id: string;
  player_id: string;
  team_id: string;
};

export function buildStandingFixtures(
  fixtures: readonly FixtureRow[],
  events: readonly EventRow[],
  participations: readonly ParticipationRow[],
): StandingFixture[] {
  const lineupByFixture = new Map<string, { playerId: string; teamId: string }[]>();
  for (const row of participations) {
    const list = lineupByFixture.get(row.fixture_id) ?? [];
    list.push({ playerId: row.player_id, teamId: row.team_id });
    lineupByFixture.set(row.fixture_id, list);
  }

  return fixtures.map((fixture) => {
    const lineup = lineupByFixture.get(fixture.id) ?? [];
    const scoreEvents = events
      .filter((e) => e.fixture_id === fixture.id)
      .flatMap((e) => {
        if (e.event_type !== "goal" && e.event_type !== "own_goal") return [];
        const teamId = resolveEventTeam(e.player_id, lineup);
        return teamId ? [{ eventType: e.event_type as "goal" | "own_goal", teamId }] : [];
      });
    const score = calculateMatchScore({
      homeTeamId: fixture.home_team_id,
      awayTeamId: fixture.away_team_id,
      events: scoreEvents,
    });
    return {
      homeTeamId: fixture.home_team_id,
      awayTeamId: fixture.away_team_id,
      status: fixture.status,
      walkoverWinnerTeamId: fixture.walkover_winner_team_id,
      homeGoals: score.homeGoals,
      awayGoals: score.awayGoals,
    };
  });
}
