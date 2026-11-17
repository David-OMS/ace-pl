import "server-only";

import type { FantasyRank } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { FantasyPickView } from "./get-my-fantasy-team";
import { mapFantasyPicks } from "./map-fantasy-picks";

export type FantasyGameweekPickView = FantasyPickView & {
  appliedPoints: number;
  rawPoints: number;
  inXi: boolean;
};

export type FantasyGameweekView = {
  gameDayId: string;
  formation: string;
  points: number;
  picks: FantasyGameweekPickView[];
};

export async function getFantasyTeamGameweek(args: {
  teamId: string;
  gameDayId: string;
  tournamentId: string;
}): Promise<FantasyGameweekView | null> {
  const snap = await loadSnapshot(args.teamId, args.gameDayId);
  if (!snap) return null;
  return mapGameweekView(snap, args.tournamentId);
}

async function loadSnapshot(teamId: string, gameDayId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: gw, error: gwError } = await supabase
    .from("fantasy_team_gameweeks")
    .select("formation, points, game_day_id")
    .eq("team_id", teamId)
    .eq("game_day_id", gameDayId)
    .maybeSingle();
  if (gwError) throw gwError;
  if (!gw) return null;

  const { data: pickRows, error: picksError } = await supabase
    .from("fantasy_gameweek_picks")
    .select(
      "player_id, slot, is_bench, is_captain, is_vice, raw_points, applied_points, in_xi, players!inner(id, name, position, photo_path)",
    )
    .eq("team_id", teamId)
    .eq("game_day_id", gameDayId)
    .order("slot");
  if (picksError) throw picksError;
  return { gw, rows: pickRows ?? [] };
}

async function mapGameweekView(
  snap: NonNullable<Awaited<ReturnType<typeof loadSnapshot>>>,
  tournamentId: string,
): Promise<FantasyGameweekView> {
  const { gw, rows } = snap;
  const ranks = await loadRanks(
    tournamentId,
    rows.map((p) => p.player_id),
  );
  const mapped = mapFantasyPicks(
    rows.map((row) => ({
      player_id: row.player_id,
      slot: row.slot,
      is_bench: row.is_bench,
      is_captain: row.is_captain,
      is_vice: row.is_vice,
      players: {
        id: row.players.id,
        name: row.players.name,
        position: row.players.position as PlayerPosition,
        photo_path: row.players.photo_path,
      },
    })),
    ranks,
  );

  return {
    gameDayId: gw.game_day_id,
    formation: gw.formation,
    points: gw.points,
    picks: mapped.map((pick) => {
      const row = rows.find((p) => p.player_id === pick.playerId);
      return {
        ...pick,
        appliedPoints: row?.applied_points ?? 0,
        rawPoints: row?.raw_points ?? 0,
        inXi: row?.in_xi ?? !pick.isBench,
      };
    }),
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
