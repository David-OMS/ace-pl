import "server-only";

import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

export type StandingsTournamentChip = {
  id: string;
  name: string;
  status: string;
};

/** Newest first, including a tournament that has not started. No results yet still has a table. */
export function listStandingsTournaments(): Promise<StandingsTournamentChip[]> {
  return fanPublicCache("standings-tournaments-any-status", readStandingsTournaments);
}

async function readStandingsTournaments(): Promise<StandingsTournamentChip[]> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select("id, name, status")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
