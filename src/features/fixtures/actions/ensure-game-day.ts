import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logger";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

/** Finds or creates a game day for the given date. */
export async function ensureGameDay(
  supabase: Client,
  tournamentId: string,
  playedOn: string,
): Promise<string | null> {
  const existing = await supabase
    .from("game_days")
    .select("id")
    .eq("tournament_id", tournamentId)
    .eq("played_on", playedOn)
    .maybeSingle();
  if (existing.error) {
    logger.error("ensure_game_day_lookup_failed", { tournamentId, error: existing.error });
    return null;
  }
  if (existing.data) return existing.data.id;

  const created = await supabase
    .from("game_days")
    .insert({ tournament_id: tournamentId, played_on: playedOn })
    .select("id")
    .maybeSingle();
  if (created.error || !created.data) {
    logger.error("ensure_game_day_insert_failed", { tournamentId, error: created.error });
    return null;
  }
  return created.data.id;
}
