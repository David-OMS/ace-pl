import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type StandingsTournamentChip = {
  id: string;
  name: string;
  status: string;
};

/** Active + completed tournaments for league chips (newest first). */
export async function listStandingsTournaments(): Promise<StandingsTournamentChip[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select("id, name, status")
    .in("status", ["active", "completed"])
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
