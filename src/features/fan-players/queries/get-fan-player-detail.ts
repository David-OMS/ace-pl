import "server-only";

import type { PlayerPosition } from "@/config/player-positions";
import { resolveFanTournament } from "@/features/home";
import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { playerPhotoUrl } from "@/lib/players/player-photo-url";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import { resolveFantasyPrice } from "../domain/resolve-fantasy-price";
import type { FanPlayerDetail } from "./fan-player-detail-model";
import { loadFanStatScope } from "./load-fan-stat-scope";
import { loadPlayerTeamName } from "./load-player-team-name";
import { mapFanPlayerDetail } from "./map-fan-player-detail";

export type { FanPlayerDetail } from "./fan-player-detail-model";

export function getFanPlayerDetail(playerId: string): Promise<FanPlayerDetail | null> {
  return fanPublicCache(`fan-player:${playerId}`, () => readFanPlayerDetail(playerId));
}

async function readFanPlayerDetail(playerId: string): Promise<FanPlayerDetail | null> {
  const supabase = createPublicSupabaseClient();
  const { data: player, error } = await supabase
    .from("players")
    .select("id, name, position, photo_path")
    .eq("id", playerId)
    .maybeSingle();

  if (error) throw error;
  if (!player) return null;

  const tournament = await resolveFanTournament();
  const loaded = await loadDetailScopes(tournament?.id ?? null, playerId);
  const rosterRows = loaded.roster.map((p) => ({
    id: p.id,
    name: p.name,
    position: p.position as PlayerPosition,
    photoUrl: playerPhotoUrl(p.photo_path),
  }));

  return mapFanPlayerDetail({
    player: { ...player, position: player.position as PlayerPosition },
    photoUrl: playerPhotoUrl(player.photo_path),
    priceMillions: loaded.priceMillions,
    teamName: loaded.teamName,
    tournamentName: tournament?.name ?? null,
    tournamentScope: loaded.tournamentScope,
    allTimeScope: loaded.allTimeScope,
    roster: rosterRows,
  });
}

async function loadDetailScopes(tournamentId: string | null, playerId: string) {
  const supabase = createPublicSupabaseClient();
  const emptyScope = {
    totals: [],
    goalsConceded: new Map<string, number>(),
    fantasyCleanSheets: new Map<string, number>(),
    fantasyPoints: new Map<string, number>(),
  };
  const [tournamentScope, allTimeScope, roster, priceMillions, teamName] = await Promise.all([
    tournamentId ? loadFanStatScope(tournamentId) : Promise.resolve(emptyScope),
    loadFanStatScope(null),
    supabase.from("players").select("id, name, position, photo_path").eq("is_active", true),
    loadPlayerPrice(tournamentId, playerId),
    tournamentId ? loadPlayerTeamName(tournamentId, playerId) : Promise.resolve(null),
  ]);
  if (roster.error) throw roster.error;
  return {
    tournamentScope,
    allTimeScope,
    roster: roster.data ?? [],
    priceMillions,
    teamName,
  };
}

async function loadPlayerPrice(tournamentId: string | null, playerId: string): Promise<number> {
  if (!tournamentId) return resolveFantasyPrice(null);
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("fantasy_player_ranks")
    .select("price")
    .eq("tournament_id", tournamentId)
    .eq("player_id", playerId)
    .maybeSingle();
  if (error) throw error;
  return resolveFantasyPrice(data ? Number(data.price) : null);
}
