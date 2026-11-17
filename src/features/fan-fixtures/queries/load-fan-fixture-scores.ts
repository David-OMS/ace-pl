import "server-only";

import type { FixtureStatus } from "@/config/fixture-status";
import { calculateMatchScore } from "@/features/matches";
import { resolveEventTeam } from "@/features/matches";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { isFixtureFinished } from "../domain/is-fixture-finished";

type ScoreFixture = {
  id: string;
  status: FixtureStatus;
  homeTeamId: string;
  awayTeamId: string;
};

export type FixtureListScore = { homeGoals: number; awayGoals: number };

export async function loadFanFixtureScores(
  fixtures: readonly ScoreFixture[],
): Promise<Map<string, FixtureListScore>> {
  const finished = fixtures.filter((fixture) => isFixtureFinished(fixture.status));
  if (finished.length === 0) return new Map();

  const supabase = await createSupabaseServerClient();
  const ids = finished.map((fixture) => fixture.id);
  const [eventsResult, participationsResult] = await Promise.all([
    supabase
      .from("match_events")
      .select("fixture_id, event_type, player_id")
      .in("fixture_id", ids)
      .in("event_type", ["goal", "own_goal"]),
    supabase
      .from("match_participations")
      .select("fixture_id, player_id, team_id")
      .in("fixture_id", ids),
  ]);

  if (eventsResult.error) throw eventsResult.error;
  if (participationsResult.error) throw participationsResult.error;

  const lineupByFixture = groupLineups(participationsResult.data ?? []);
  const scores = new Map<string, FixtureListScore>();

  for (const fixture of finished) {
    const lineup = lineupByFixture.get(fixture.id) ?? [];
    const scoreEvents = (eventsResult.data ?? []).flatMap((row) => {
      if (row.fixture_id !== fixture.id) return [];
      if (row.event_type !== "goal" && row.event_type !== "own_goal") return [];
      const teamId = resolveEventTeam(row.player_id, lineup);
      return teamId ? [{ eventType: row.event_type as "goal" | "own_goal", teamId }] : [];
    });
    scores.set(
      fixture.id,
      calculateMatchScore({
        homeTeamId: fixture.homeTeamId,
        awayTeamId: fixture.awayTeamId,
        events: scoreEvents,
      }),
    );
  }

  return scores;
}

function groupLineups(
  rows: readonly { fixture_id: string; player_id: string; team_id: string }[],
): Map<string, { playerId: string; teamId: string }[]> {
  const map = new Map<string, { playerId: string; teamId: string }[]>();
  for (const row of rows) {
    const list = map.get(row.fixture_id) ?? [];
    list.push({ playerId: row.player_id, teamId: row.team_id });
    map.set(row.fixture_id, list);
  }
  return map;
}
