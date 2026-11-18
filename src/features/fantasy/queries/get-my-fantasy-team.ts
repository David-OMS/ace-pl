import "server-only";

import type { FantasyRank } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { mapFantasyPicks } from "./map-fantasy-picks";

export type FantasyPickView = {
  playerId: string;
  name: string;
  position: PlayerPosition;
  photoUrl: string | null;
  rank: FantasyRank;
  price: number;
  slot: number;
  isBench: boolean;
  isCaptain: boolean;
  isVice: boolean;
};

export type MyFantasyTeam = {
  id: string;
  tournamentId: string;
  name: string;
  nameChangeCount: number;
  formation: string;
  bank: number;
  totalPoints: number;
  freeTransfers: number;
  picks: FantasyPickView[];
};

export async function getMyFantasyTeam(args: {
  tournamentId: string;
  userId: string;
}): Promise<MyFantasyTeam | null> {
  const supabase = await createSupabaseServerClient();
  const { data: team, error } = await supabase
    .from("fantasy_teams")
    .select(
      "id, tournament_id, name, name_change_count, formation, bank, total_points, free_transfers",
    )
    .eq("tournament_id", args.tournamentId)
    .eq("user_id", args.userId)
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
  const ranks = await loadPickRanks(args.tournamentId, playerIds);

  return {
    id: team.id,
    tournamentId: team.tournament_id,
    name: team.name,
    nameChangeCount: team.name_change_count,
    formation: team.formation,
    bank: Number(team.bank),
    totalPoints: team.total_points,
    freeTransfers: team.free_transfers,
    picks: mapFantasyPicks(pickRows ?? [], ranks),
  };
}

async function loadPickRanks(
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
