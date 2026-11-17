import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type FantasyLeaderboardRow = {
  teamId: string;
  teamName: string;
  ownerName: string;
  userId: string;
  totalPoints: number;
  rank: number;
};

export async function listFantasyLeaderboard(
  tournamentId: string,
): Promise<FantasyLeaderboardRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("fantasy_teams")
    .select("id, name, user_id, total_points, profiles!inner(display_name)")
    .eq("tournament_id", tournamentId)
    .order("total_points", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row, index) => ({
    teamId: row.id,
    teamName: row.name,
    ownerName: row.profiles.display_name,
    userId: row.user_id,
    totalPoints: row.total_points,
    rank: index + 1,
  }));
}
