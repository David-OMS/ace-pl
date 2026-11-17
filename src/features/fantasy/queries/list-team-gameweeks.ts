import "server-only";

import type { FantasyRank } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { FantasyGameweekView } from "./get-fantasy-team-gameweek";
import { mapFantasyPicks } from "./map-fantasy-picks";

const EMPTY_UUID = "00000000-0000-0000-0000-000000000000";

type SnapshotPick = {
  game_day_id: string;
  player_id: string;
  slot: number;
  is_bench: boolean;
  is_captain: boolean;
  is_vice: boolean;
  raw_points: number;
  applied_points: number;
  in_xi: boolean;
  players: {
    id: string;
    name: string;
    position: string;
    photo_path: string | null;
  };
};

/** Every scored gameweek for one squad, so GW chips can switch without another page load. */
export async function listTeamGameweeks(args: {
  teamId: string;
  tournamentId: string;
}): Promise<FantasyGameweekView[]> {
  const { weeks, picks } = await loadSnapshots(args.teamId);
  if (weeks.length === 0) return [];
  const ranks = await loadRanks(
    args.tournamentId,
    picks.map((pick) => pick.player_id),
  );
  return weeks.map((week) =>
    toGameweekView(
      week,
      picks.filter((pick) => pick.game_day_id === week.game_day_id),
      ranks,
    ),
  );
}

async function loadSnapshots(teamId: string) {
  const supabase = await createSupabaseServerClient();
  const [weeks, picks] = await Promise.all([
    supabase
      .from("fantasy_team_gameweeks")
      .select("formation, points, game_day_id")
      .eq("team_id", teamId),
    supabase
      .from("fantasy_gameweek_picks")
      .select(
        "game_day_id, player_id, slot, is_bench, is_captain, is_vice, raw_points, applied_points, in_xi, players!inner(id, name, position, photo_path)",
      )
      .eq("team_id", teamId)
      .order("slot"),
  ]);
  if (weeks.error) throw weeks.error;
  if (picks.error) throw picks.error;
  return { weeks: weeks.data ?? [], picks: (picks.data ?? []) as SnapshotPick[] };
}

async function loadRanks(tournamentId: string, playerIds: string[]) {
  const supabase = await createSupabaseServerClient();
  const unique = [...new Set(playerIds)];
  const { data, error } = await supabase
    .from("fantasy_player_ranks")
    .select("player_id, rank, price")
    .eq("tournament_id", tournamentId)
    .in("player_id", unique.length > 0 ? unique : [EMPTY_UUID]);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    player_id: row.player_id,
    rank: row.rank as FantasyRank,
    price: Number(row.price),
  }));
}

function toGameweekView(
  week: { formation: string; points: number; game_day_id: string },
  picks: SnapshotPick[],
  ranks: { player_id: string; rank: FantasyRank; price: number }[],
): FantasyGameweekView {
  const mapped = mapFantasyPicks(
    picks.map((row) => ({
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
    gameDayId: week.game_day_id,
    formation: week.formation,
    points: week.points,
    picks: mapped.map((pick) => {
      const row = picks.find((item) => item.player_id === pick.playerId);
      return {
        ...pick,
        appliedPoints: row?.applied_points ?? 0,
        rawPoints: row?.raw_points ?? 0,
        inXi: row?.in_xi ?? !pick.isBench,
      };
    }),
  };
}
