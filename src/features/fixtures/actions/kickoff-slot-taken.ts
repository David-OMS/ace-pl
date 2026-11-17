import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

import { toKickoffTime } from "../schemas/fixture-input-schema";

/** True when another fixture already owns this game-day + kick-off slot. */
export async function kickoffSlotTaken(
  supabase: SupabaseClient<Database>,
  input: {
    tournamentId: string;
    gameDayId: string;
    kickoffTime: string;
    excludeFixtureId: string;
  },
): Promise<boolean> {
  const kickoff = toKickoffTime(input.kickoffTime);
  const { data, error } = await supabase
    .from("fixtures")
    .select("id")
    .eq("tournament_id", input.tournamentId)
    .eq("game_day_id", input.gameDayId)
    .eq("kickoff_time", kickoff)
    .neq("id", input.excludeFixtureId)
    .neq("status", "postponed")
    .limit(1);

  if (error) throw error;
  return (data?.length ?? 0) > 0;
}
