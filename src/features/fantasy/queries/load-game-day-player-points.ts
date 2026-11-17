import "server-only";

import type { PlayerPosition } from "@/config/player-positions";
import { assembleStatTotals, calculatePlayerFantasyPoints } from "@/features/fan-players";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { PlayerDayPoints } from "../domain/score-fantasy-gameweek-team";
import { fetchGameDayMatchRows } from "./fetch-game-day-match-rows";

const EMPTY_UUID = "00000000-0000-0000-0000-000000000000";

/** Raw fantasy points per real player for one Friday (all finished fixtures). */
export async function loadGameDayPlayerPoints(gameDayId: string): Promise<PlayerDayPoints[]> {
  const { fixtureRows, participationRows, eventRows } = await fetchGameDayMatchRows(gameDayId);
  if (fixtureRows.length === 0) return [];

  const playerIds = [...new Set(participationRows.map((row) => row.player_id))];
  const positionById = await loadPositions(playerIds);

  const enrichedParticipations = participationRows.map((row) => ({
    ...row,
    position: (row.position as PlayerPosition | null) ?? positionById.get(row.player_id) ?? null,
  }));

  const assembled = assembleStatTotals(enrichedParticipations, eventRows, fixtureRows);

  return assembled.totals.map((total) => {
    const position = positionById.get(total.playerId) ?? "MID";
    const goalsConceded = assembled.goalsConceded.get(total.playerId) ?? 0;
    return {
      playerId: total.playerId,
      rawPoints: calculatePlayerFantasyPoints(position, {
        ...total,
        goalsConceded,
      }),
      played: total.apps > 0,
    };
  });
}

async function loadPositions(playerIds: string[]): Promise<Map<string, PlayerPosition>> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, position")
    .in("id", playerIds.length > 0 ? playerIds : [EMPTY_UUID]);
  if (error) throw error;
  return new Map((data ?? []).map((p) => [p.id, p.position as PlayerPosition]));
}
