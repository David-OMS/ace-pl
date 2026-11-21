import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/** Drop events for a player marked absent so stats and fantasy stay consistent. */
export async function clearPlayerMatchEvents(
  supabase: SupabaseClient<Database>,
  input: { fixtureId: string; playerId: string },
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase
    .from("match_events")
    .delete()
    .eq("fixture_id", input.fixtureId)
    .or(`player_id.eq.${input.playerId},assist_player_id.eq.${input.playerId}`);
  return { error };
}
