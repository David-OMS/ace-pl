import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { FantasyPickView, MyFantasyTeam } from "./get-my-fantasy-team";
import { loadFantasyPrices } from "./load-fantasy-prices";
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
      "id, tournament_id, name, name_change_count, formation, bank, total_points, free_transfers, user_id, profiles!inner(display_name)",
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
  const ranks = await loadFantasyPrices(playerIds);
  const picks: FantasyPickView[] = mapFantasyPicks(pickRows ?? [], ranks);

  return {
    id: team.id,
    tournamentId: team.tournament_id,
    name: team.name,
    nameChangeCount: team.name_change_count,
    formation: team.formation,
    bank: Number(team.bank),
    totalPoints: team.total_points,
    freeTransfers: team.free_transfers,
    picks,
    ownerName: team.profiles.display_name,
    userId: team.user_id,
  };
}
