import "server-only";

import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { assembleMatchEntry } from "./assemble-match-entry";
import type { MatchEntry } from "./match-entry-types";
import { fetchMatchEntryRows } from "./fetch-match-entry-rows";

export type { MatchEntry, MatchEventRow, MatchPlayer } from "./match-entry-types";

export async function getMatchEntry(fixtureId: string): Promise<MatchEntry | null> {
  if (!z.uuid().safeParse(fixtureId).success) return null;

  const supabase = await createSupabaseServerClient();
  const { data: fixture, error } = await supabase
    .from("fixtures")
    .select("id, tournament_id, status, kickoff_time, home_team_id, away_team_id, game_day_id")
    .eq("id", fixtureId)
    .maybeSingle();

  if (error) throw error;
  if (!fixture) return null;

  const rows = await fetchMatchEntryRows(supabase, fixture);
  return assembleMatchEntry({ fixture, ...rows });
}
