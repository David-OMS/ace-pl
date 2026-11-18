import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

import { isSameFantasyTeamName, normalizeFantasyTeamName } from "../domain/fantasy-team-name";

/** True when another team in this tournament already uses this name. */
export async function isFantasyTeamNameTaken(
  supabase: SupabaseClient<Database>,
  input: { tournamentId: string; name: string; exceptTeamId?: string },
): Promise<boolean> {
  const wanted = normalizeFantasyTeamName(input.name);
  const { data, error } = await supabase
    .from("fantasy_teams")
    .select("id, name")
    .eq("tournament_id", input.tournamentId);
  if (error) throw error;

  return (data ?? []).some((row) => {
    if (input.exceptTeamId && row.id === input.exceptTeamId) return false;
    return isSameFantasyTeamName(row.name, wanted);
  });
}
