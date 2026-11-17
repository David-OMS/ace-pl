import "server-only";

import type { MatchEventType } from "@/config/match-events";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

type InsertMatchEventInput = {
  tournamentId: string;
  fixtureId: string;
  eventType: MatchEventType;
  playerId: string;
  assistPlayerId: string | null;
  quantity: number;
};

export async function insertMatchEvent(
  input: InsertMatchEventInput,
): Promise<{ error: { code?: string } | null }> {
  const supabase = await createSupabaseServerClient();
  const { data: last } = await supabase
    .from("match_events")
    .select("sort_order")
    .eq("fixture_id", input.fixtureId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("match_events").insert({
    tournament_id: input.tournamentId,
    fixture_id: input.fixtureId,
    event_type: input.eventType,
    player_id: input.playerId,
    assist_player_id: input.assistPlayerId,
    quantity: input.eventType === "saves" ? input.quantity : 1,
    sort_order: (last?.sort_order ?? 0) + 1,
  });

  return { error };
}
