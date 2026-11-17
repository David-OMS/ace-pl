import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/** Roster rows plus anyone already on a team (covers seeds that skipped tournament_players). */
export async function loadRosterPlayerIds(
  supabase: SupabaseClient<Database>,
  tournamentId: string,
): Promise<string[]> {
  const [roster, members] = await Promise.all([
    supabase.from("tournament_players").select("player_id").eq("tournament_id", tournamentId),
    supabase
      .from("team_memberships")
      .select("player_id")
      .eq("tournament_id", tournamentId)
      .is("left_on", null),
  ]);

  if (roster.error) throw roster.error;
  if (members.error) throw members.error;

  return [
    ...new Set([
      ...(roster.data ?? []).map((row) => row.player_id),
      ...(members.data ?? []).map((row) => row.player_id),
    ]),
  ];
}
