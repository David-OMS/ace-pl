import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type GameDayPointsSummary = {
  gameDayId: string;
  average: number;
  highest: number;
};

/** Average and highest fantasy team points per game day in a tournament. */
export async function listGameDayPointSummaries(
  tournamentId: string,
): Promise<readonly GameDayPointsSummary[]> {
  const supabase = await createSupabaseServerClient();
  const { data: teams, error: teamsError } = await supabase
    .from("fantasy_teams")
    .select("id")
    .eq("tournament_id", tournamentId);
  if (teamsError) throw teamsError;
  const teamIds = (teams ?? []).map((row) => row.id);
  if (teamIds.length === 0) return [];

  const { data, error } = await supabase
    .from("fantasy_team_gameweeks")
    .select("game_day_id, points")
    .in("team_id", teamIds);
  if (error) throw error;

  const buckets = new Map<string, number[]>();
  for (const row of data ?? []) {
    const list = buckets.get(row.game_day_id) ?? [];
    list.push(row.points);
    buckets.set(row.game_day_id, list);
  }

  return [...buckets.entries()].map(([gameDayId, points]) => ({
    gameDayId,
    average: Math.round(points.reduce((sum, n) => sum + n, 0) / points.length),
    highest: Math.max(...points),
  }));
}
