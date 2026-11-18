import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/** Public team header only — never includes live picks. */
export type FantasyTeamPublicHeader = {
  id: string;
  tournamentId: string;
  name: string;
  formation: string;
  totalPoints: number;
  ownerName: string;
  userId: string;
};

export async function getFantasyTeamPublicHeader(
  teamId: string,
): Promise<FantasyTeamPublicHeader | null> {
  const supabase = await createSupabaseServerClient();
  const { data: team, error } = await supabase
    .from("fantasy_teams")
    .select(
      "id, tournament_id, name, formation, total_points, user_id, profiles!inner(display_name)",
    )
    .eq("id", teamId)
    .maybeSingle();
  if (error) throw error;
  if (!team) return null;

  return {
    id: team.id,
    tournamentId: team.tournament_id,
    name: team.name,
    formation: team.formation,
    totalPoints: team.total_points,
    ownerName: team.profiles.display_name,
    userId: team.user_id,
  };
}
