import "server-only";

import type { FantasyRank } from "@/config/fantasy";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { FantasyPickView, MyFantasyTeam } from "./get-my-fantasy-team";
import { mapFantasyPicks } from "./map-fantasy-picks";

export type PublicFantasyTeam = MyFantasyTeam & {
  ownerName: string;
  userId: string;
};

export async function getFantasyTeamById(teamId: string): Promise<PublicFantasyTeam | null> {
  const supabase = await createSupabaseServerClient();
  const { data: team, error } = await supabase
    .from("fantasy_teams")
    .select(
      "id, tournament_id, name, formation, bank, total_points, free_transfers, user_id, profiles!inner(display_name)",
    )
    .eq("id", teamId)
    .maybeSingle();
  if (error) throw error;
  if (!team) return null;

  const { data: pickRows, error: picksError } = await supabase
    .from("fantasy_picks")
    .select(
      "player_id, slot, is_bench, is_captain, is_vice, players!inner(id, name, position, photo_path)",
    )
    .eq("team_id", team.id)
    .order("slot");
  if (picksError) throw picksError;

  const playerIds = (pickRows ?? []).map((p) => p.player_id);
  const ranks = await loadRanks(team.tournament_id, playerIds);
  const picks: FantasyPickView[] = mapFantasyPicks(pickRows ?? [], ranks);

  return {
    id: team.id,
    tournamentId: team.tournament_id,
    name: team.name,
    formation: team.formation,
    bank: Number(team.bank),
    totalPoints: team.total_points,
    freeTransfers: team.free_transfers,
    picks,
    ownerName: team.profiles.display_name,
    userId: team.user_id,
  };
}

async function loadRanks(
  tournamentId: string,
  playerIds: string[],
): Promise<{ player_id: string; rank: FantasyRank; price: number }[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("fantasy_player_ranks")
    .select("player_id, rank, price")
    .eq("tournament_id", tournamentId)
    .in("player_id", playerIds.length > 0 ? playerIds : ["00000000-0000-0000-0000-000000000000"]);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    player_id: r.player_id,
    rank: r.rank as FantasyRank,
    price: Number(r.price),
  }));
}
