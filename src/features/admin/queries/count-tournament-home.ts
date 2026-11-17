import "server-only";

import { loadRosterPlayerIds } from "@/features/tournaments/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type TournamentHomeCounts = {
  rosterCount: number;
  teamCount: number;
  unassignedCount: number;
  fixtureCount: number;
  nextGameDay: string | null;
};

export async function countTournamentHome(tournamentId: string): Promise<TournamentHomeCounts> {
  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().slice(0, 10);
  const [rosterPlayerIds, teams, memberships, fixtures, gameDay] = await Promise.all([
    loadRosterPlayerIds(supabase, tournamentId),
    supabase
      .from("teams")
      .select("id", { count: "exact", head: true })
      .eq("tournament_id", tournamentId),
    supabase
      .from("team_memberships")
      .select("player_id", { count: "exact", head: true })
      .eq("tournament_id", tournamentId)
      .is("left_on", null),
    supabase
      .from("fixtures")
      .select("id", { count: "exact", head: true })
      .eq("tournament_id", tournamentId),
    supabase
      .from("game_days")
      .select("played_on")
      .eq("tournament_id", tournamentId)
      .gte("played_on", today)
      .order("played_on", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const error = [teams.error, memberships.error, fixtures.error, gameDay.error].find(Boolean);
  if (error) throw error;

  const rosterCount = rosterPlayerIds.length;
  const assignedCount = memberships.count ?? 0;
  return {
    rosterCount,
    teamCount: teams.count ?? 0,
    unassignedCount: Math.max(0, rosterCount - assignedCount),
    fixtureCount: fixtures.count ?? 0,
    nextGameDay: gameDay.data?.played_on ?? null,
  };
}
