import "server-only";

import type { TournamentStatus } from "@/config/tournament-rules";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type TournamentSummary = { id: string; name: string; status: TournamentStatus };

/** Newest first. */
export async function listTournaments(): Promise<TournamentSummary[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select("id, name, status")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
