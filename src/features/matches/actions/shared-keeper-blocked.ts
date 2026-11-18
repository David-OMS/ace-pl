import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type SharedKeeperBlockedInput = {
  tournamentId: string;
  fixtureId: string;
  teamId: string;
  playerId: string;
};

/** True when a side with a fixed GK tries to borrow a shared keeper. */
export async function sharedKeeperBlocked(
  supabase: SupabaseClient<Database>,
  input: SharedKeeperBlockedInput,
): Promise<boolean> {
  const { tournamentId, fixtureId, teamId, playerId } = input;
  const [tournament, keepers, lineup] = await Promise.all([
    supabase.from("tournaments").select("keeper_mode").eq("id", tournamentId).maybeSingle(),
    supabase
      .from("tournament_keepers")
      .select("player_id")
      .eq("tournament_id", tournamentId)
      .eq("player_id", playerId)
      .maybeSingle(),
    supabase
      .from("match_participations")
      .select("id")
      .eq("fixture_id", fixtureId)
      .eq("team_id", teamId)
      .eq("is_goalkeeper", true)
      .limit(1),
  ]);

  if (tournament.error) throw tournament.error;
  if (keepers.error) throw keepers.error;
  if (lineup.error) throw lineup.error;
  if (tournament.data?.keeper_mode !== "shared") return false;
  if (!keepers.data) return false;
  return (lineup.data?.length ?? 0) > 0;
}
