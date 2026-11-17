import "server-only";

import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

export type StandingsTournamentChip = {
  id: string;
  name: string;
  status: string;
};

/** Active + completed tournaments for league chips (newest first). */
export function listStandingsTournaments(): Promise<StandingsTournamentChip[]> {
  return fanPublicCache("standings-tournaments", readStandingsTournaments);
}

async function readStandingsTournaments(): Promise<StandingsTournamentChip[]> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select("id, name, status")
    .in("status", ["active", "completed"])
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
