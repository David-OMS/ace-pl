import "server-only";

import type { PlayerPosition } from "@/config/player-positions";
import { resolveFanTournament } from "@/features/home";
import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { playerPhotoUrl } from "@/lib/players/player-photo-url";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import { resolveFantasyPrice } from "../domain/resolve-fantasy-price";
import type { FanPlayerDetail } from "./fan-player-detail-model";
import { loadFanStatScope } from "./load-fan-stat-scope";
import { loadPlayerTeam } from "./load-player-team";
import { mapFanPlayerDetail } from "./map-fan-player-detail";

export type { FanPlayerDetail } from "./fan-player-detail-model";

type PlayerRow = {
  id: string;
  name: string;
  position: PlayerPosition;
  photo_path: string | null;
};

export function getFanPlayerDetail(playerId: string): Promise<FanPlayerDetail | null> {
  return fanPublicCache(`fan-player:${playerId}`, () => readFanPlayerDetail(playerId));
}

async function readFanPlayerDetail(playerId: string): Promise<FanPlayerDetail | null> {
  const player = await loadPlayerRow(playerId);
  if (!player) return null;

  const tournament = await resolveFanTournament();
  const loaded = await loadDetailScopes(tournament?.id ?? null, playerId);
  return mapFanPlayerDetail({
    player,
    photoUrl: playerPhotoUrl(player.photo_path),
    priceMillions: loaded.priceMillions,
    teamName: loaded.team?.name ?? null,
    teamColor: loaded.team?.color ?? null,
    tournamentName: tournament?.name ?? null,
    tournamentScope: loaded.tournamentScope,
    allTimeScope: loaded.allTimeScope,
    roster: loaded.roster,
  });
}

async function loadPlayerRow(playerId: string): Promise<PlayerRow | null> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, name, position, photo_path")
    .eq("id", playerId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { ...data, position: data.position as PlayerPosition };
}

async function loadDetailScopes(tournamentId: string | null, playerId: string) {
  const emptyScope = {
    totals: [],
    goalsConceded: new Map<string, number>(),
    fantasyCleanSheets: new Map<string, number>(),
    fantasyPoints: new Map<string, number>(),
  };
  const supabase = createPublicSupabaseClient();
  const [tournamentScope, allTimeScope, roster, priceMillions, team] = await Promise.all([
    tournamentId ? loadFanStatScope(tournamentId) : Promise.resolve(emptyScope),
    loadFanStatScope(null),
    supabase.from("players").select("id, name, position, photo_path").eq("is_active", true),
    loadPlayerPrice(playerId),
    tournamentId ? loadPlayerTeam(tournamentId, playerId) : Promise.resolve(null),
  ]);
  if (roster.error) throw roster.error;
  return {
    tournamentScope,
    allTimeScope,
    roster: (roster.data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      position: p.position as PlayerPosition,
      photoUrl: playerPhotoUrl(p.photo_path),
    })),
    priceMillions,
    team,
  };
}

async function loadPlayerPrice(playerId: string): Promise<number> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("fantasy_player_prices")
    .select("price")
    .eq("player_id", playerId)
    .maybeSingle();
  if (error) throw error;
  return resolveFantasyPrice(data ? Number(data.price) : null);
}
