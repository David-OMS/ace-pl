import "server-only";

import { z } from "zod";

import type { FirstPlaceTiebreak, KeeperMode, TournamentStatus } from "@/config/tournament-rules";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { syncTournamentStatus } from "../actions/sync-tournament-status";
import { loadRosterPlayerIds } from "./load-roster-player-ids";

export type GameDay = { id: string; playedOn: string };

export type SharedKeeper = { playerId: string; name: string };

export type TournamentDetail = {
  id: string;
  name: string;
  status: TournamentStatus;
  startsOn: string | null;
  endsOn: string | null;
  playersOnPitch: number;
  squadSize: number;
  matchesPerGameDay: number;
  firstPlaceTiebreak: FirstPlaceTiebreak;
  keeperMode: KeeperMode;
  gameDays: GameDay[];
  sharedKeepers: SharedKeeper[];
  rosterPlayerIds: string[];
};

export async function getTournament(tournamentId: string): Promise<TournamentDetail | null> {
  if (!z.uuid().safeParse(tournamentId).success) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select(
      "id, name, status, starts_on, ends_on, players_on_pitch, squad_size, matches_per_game_day, first_place_tiebreak, keeper_mode, game_days(id, played_on)",
    )
    .eq("id", tournamentId)
    .order("played_on", { referencedTable: "game_days" })
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  await syncTournamentStatus(supabase, tournamentId);

  const [refreshed, keepers, rosterPlayerIds] = await Promise.all([
    supabase.from("tournaments").select("status").eq("id", tournamentId).maybeSingle(),
    supabase
      .from("tournament_keepers")
      .select("player_id, players(name)")
      .eq("tournament_id", tournamentId),
    loadRosterPlayerIds(supabase, tournamentId),
  ]);

  if (keepers.error) throw keepers.error;
  if (refreshed.error) throw refreshed.error;

  return {
    id: data.id,
    name: data.name,
    status: refreshed.data?.status ?? data.status,
    startsOn: data.starts_on,
    endsOn: data.ends_on,
    playersOnPitch: data.players_on_pitch,
    squadSize: data.squad_size,
    matchesPerGameDay: data.matches_per_game_day,
    firstPlaceTiebreak: data.first_place_tiebreak,
    keeperMode: data.keeper_mode,
    gameDays: data.game_days.map((day) => ({ id: day.id, playedOn: day.played_on })),
    sharedKeepers: (keepers.data ?? []).map((row) => ({
      playerId: row.player_id,
      name: row.players?.name ?? "?",
    })),
    rosterPlayerIds,
  };
}
