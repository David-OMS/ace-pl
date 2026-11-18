import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { ActionErrorCode } from "@/lib/action-result";
import type { Database } from "@/types/database";

import { isFantasyTeamNameTaken } from "../queries/is-fantasy-team-name-taken";

/** Returns an error code when create must stop; null when clear to insert. */
export async function assertFantasyTeamCreate(
  supabase: SupabaseClient<Database>,
  input: { tournamentId: string; userId: string; name: string },
): Promise<ActionErrorCode | null> {
  const { data: existing, error: existingError } = await supabase
    .from("fantasy_teams")
    .select("id")
    .eq("tournament_id", input.tournamentId)
    .eq("user_id", input.userId)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) return "forbidden";

  if (await isFantasyTeamNameTaken(supabase, input)) return "conflict";
  return null;
}
