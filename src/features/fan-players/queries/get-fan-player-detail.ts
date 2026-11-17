import "server-only";

import type { PlayerPosition } from "@/config/player-positions";
import { resolveFanTournament } from "@/features/home";
import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { playerPhotoUrl } from "@/lib/players/player-photo-url";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import { resolveFantasyPrice } from "../domain/resolve-fantasy-price";
import type { FanPlayerDetail } from "./fan-player-detail-model";
import { loadFanStatScope } from "./load-fan-stat-scope";
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
  const emptyScope = { totals: [], goalsConceded: new Map<string, number>() };
  const [tournamentScope, allTimeScope, roster, priceMillions] = await Promise.all([
    tournament ? loadFanStatScope(tournament.id) : Promise.resolve(emptyScope),
    loadFanStatScope(null),
    supabase.from("players").select("id, name, position, photo_path").eq("is_active", true),
    loadPlayerPrice(tournament?.id ?? null, playerId),
  ]);

  if (roster.error) throw roster.error;

  const rosterRows = (roster.data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    position: p.position as PlayerPosition,
    photoUrl: playerPhotoUrl(p.photo_path),
  }));

  return mapFanPlayerDetail({
    player: { ...player, position: player.position as PlayerPosition },
    photoUrl: playerPhotoUrl(player.photo_path),
    priceMillions,
    tournamentName: tournament?.name ?? null,
    tournamentScope,
    allTimeScope,
    roster: rosterRows,
  });
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
