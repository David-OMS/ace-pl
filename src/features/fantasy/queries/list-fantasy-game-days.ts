import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type FantasyGameDayOption = {
  id: string;
  playedOn: string;
  label: string;
  hasScores: boolean;
};

export async function listFantasyGameDays(tournamentId: string): Promise<FantasyGameDayOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data: days, error } = await supabase
    .from("game_days")
    .select("id, played_on")
    .eq("tournament_id", tournamentId)
    .order("played_on", { ascending: true });
  if (error) throw error;

  const { data: teams, error: teamsError } = await supabase
    .from("fantasy_teams")
    .select("id")
    .eq("tournament_id", tournamentId);
  if (teamsError) throw teamsError;
  const teamIds = (teams ?? []).map((t) => t.id);

  let scoredIds = new Set<string>();
  if (teamIds.length > 0) {
    const { data: scored, error: scoredError } = await supabase
      .from("fantasy_team_gameweeks")
      .select("game_day_id")
      .in("team_id", teamIds);
    if (scoredError) throw scoredError;
    scoredIds = new Set((scored ?? []).map((row) => row.game_day_id));
  }

  return (days ?? []).map((day, index) => ({
    id: day.id,
    playedOn: day.played_on,
    label: `GW${index + 1}`,
    hasScores: scoredIds.has(day.id),
  }));
}
