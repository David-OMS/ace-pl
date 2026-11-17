import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { buildHomeStatBoards } from "./build-home-stat-boards";
import type { HomeStatBoard } from "./home-stat-types";

export type { HomeStatBoard, HomeStatEntry } from "./home-stat-types";

export async function loadHomeStatBoards(tournamentId: string): Promise<HomeStatBoard[]> {
  const supabase = await createSupabaseServerClient();
  const [appearances, events, fixtures, players] = await Promise.all([
    supabase
      .from("match_participations")
      .select("player_id, status, team_id, fixture_id, position, is_goalkeeper")
      .eq("tournament_id", tournamentId),
    supabase
      .from("match_events")
      .select("event_type, player_id, quantity, assist_player_id, fixture_id")
      .eq("tournament_id", tournamentId),
    supabase
      .from("fixtures")
      .select("id, home_team_id, away_team_id, status, walkover_winner_team_id")
      .eq("tournament_id", tournamentId)
      .in("status", ["completed", "walkover"]),
    supabase.from("players").select("id, name, position, photo_path"),
  ]);

  for (const result of [appearances, events, fixtures, players]) {
    if (result.error) throw result.error;
  }

  return buildHomeStatBoards({
    appearances: appearances.data ?? [],
    events: events.data ?? [],
    fixtures: fixtures.data ?? [],
    players: players.data ?? [],
  });
}
