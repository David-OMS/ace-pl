import "server-only";

import type { PlayerPosition } from "@/config/player-positions";
import { DEFAULT_TEAM_COLOR } from "@/config/team-colors";
import { resolveFanTournament } from "@/features/home";
import { sortPlayers } from "@/features/players";
import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { playerPhotoUrl } from "@/lib/players/player-photo-url";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import type { FanPlayerListItem } from "../domain/filter-fan-players";

type MembershipRow = {
  player_id: string;
  teams: { name: string; color: string } | null;
};

type PlayerRow = {
  id: string;
  name: string;
  position: PlayerPosition;
  photo_path: string | null;
};

export function listFanPlayers(): Promise<FanPlayerListItem[]> {
  return fanPublicCache("fan-players", readFanPlayers);
}

async function readFanPlayers(): Promise<FanPlayerListItem[]> {
  const supabase = createPublicSupabaseClient();
  const tournament = await resolveFanTournament();
  const [playersResult, membershipsResult] = await Promise.all([
    supabase.from("players").select("id, name, position, photo_path").eq("is_active", true),
    loadMemberships(tournament?.id ?? null),
  ]);

  if (playersResult.error) throw playersResult.error;
  if (membershipsResult.error) throw membershipsResult.error;

  return mapFanPlayerList(playersResult.data ?? [], membershipsResult.data ?? []);
}

async function loadMemberships(tournamentId: string | null) {
  if (!tournamentId) {
    return { data: [] as MembershipRow[], error: null };
  }
  const supabase = createPublicSupabaseClient();
  return supabase
    .from("team_memberships")
    .select("player_id, teams(name, color)")
    .eq("tournament_id", tournamentId)
    .is("left_on", null);
}

function mapFanPlayerList(
  players: readonly PlayerRow[],
  memberships: readonly MembershipRow[],
): FanPlayerListItem[] {
  const teamByPlayer = new Map(
    memberships.flatMap((row) => {
      if (!row.teams?.name) return [];
      return [
        [
          row.player_id,
          {
            teamName: row.teams.name,
            teamColor: row.teams.color || DEFAULT_TEAM_COLOR,
          },
        ] as const,
      ];
    }),
  );

  const rows = sortPlayers(
    players.map((row) => ({
      id: row.id,
      name: row.name,
      position: row.position,
      isActive: true,
      isClaimed: false,
    })),
  );

  const photoById = new Map(players.map((row) => [row.id, row.photo_path]));
  return rows.map((row) => {
    const team = teamByPlayer.get(row.id);
    return {
      id: row.id,
      name: row.name,
      position: row.position,
      photoUrl: playerPhotoUrl(photoById.get(row.id)),
      teamName: team?.teamName ?? null,
      teamColor: team?.teamColor ?? null,
    };
  });
}
