import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type FantasyHomeTeaser = {
  kind: "signed_out" | "no_team" | "has_team";
  teamName?: string;
  rankLabel?: string;
  points?: number;
};

export async function loadFantasyHomeTeaser(args: {
  userId: string | null;
  tournamentId: string | null;
}): Promise<FantasyHomeTeaser> {
  if (!args.userId) return { kind: "signed_out" };
  if (!args.tournamentId) return { kind: "no_team" };

  try {
    return await loadTeaserForTournament(args.userId, args.tournamentId);
  } catch {
    // Migration may not be applied yet — home should still render.
    return { kind: "no_team" };
  }
}

async function loadTeaserForTournament(
  userId: string,
  tournamentId: string,
): Promise<FantasyHomeTeaser> {
  const supabase = await createSupabaseServerClient();
  const { data: team, error } = await supabase
    .from("fantasy_teams")
    .select("id, name, total_points")
    .eq("tournament_id", tournamentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!team) return { kind: "no_team" };

  const { count, error: countError } = await supabase
    .from("fantasy_teams")
    .select("id", { count: "exact", head: true })
    .eq("tournament_id", tournamentId)
    .gt("total_points", team.total_points);

  if (countError) throw countError;

  const rank = (count ?? 0) + 1;
  const { count: total, error: totalError } = await supabase
    .from("fantasy_teams")
    .select("id", { count: "exact", head: true })
    .eq("tournament_id", tournamentId);

  if (totalError) throw totalError;

  return {
    kind: "has_team",
    teamName: team.name,
    rankLabel: `Rank ${rank} of ${total ?? rank}`,
    points: team.total_points,
  };
}
