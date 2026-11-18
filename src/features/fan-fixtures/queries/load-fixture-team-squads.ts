import "server-only";

import type { MatchPlayer } from "@/features/matches";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import { mapSquadPreviewPlayers } from "../domain/map-squad-preview-players";

export async function loadFixtureTeamSquads(input: {
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
}): Promise<{ homeSquad: MatchPlayer[]; awaySquad: MatchPlayer[] }> {
  const supabase = createPublicSupabaseClient();
  const { tournamentId, homeTeamId, awayTeamId } = input;
  const [memberships, players] = await Promise.all([
    supabase
      .from("team_memberships")
      .select("player_id, team_id, is_captain")
      .eq("tournament_id", tournamentId)
      .in("team_id", [homeTeamId, awayTeamId])
      .is("left_on", null),
    supabase.from("players").select("id, name, position"),
  ]);
  if (memberships.error) throw memberships.error;
  if (players.error) throw players.error;

  const playerById = new Map((players.data ?? []).map((row) => [row.id, row]));
  const members = (memberships.data ?? []).flatMap((row) => {
    const player = playerById.get(row.player_id);
    if (!player) return [];
    return [
      {
        playerId: row.player_id,
        teamId: row.team_id,
        name: player.name,
        position: player.position,
        isCaptain: row.is_captain,
      },
    ];
  });

  return {
    homeSquad: mapSquadPreviewPlayers(members, homeTeamId),
    awaySquad: mapSquadPreviewPlayers(members, awayTeamId),
  };
}
