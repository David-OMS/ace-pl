import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { getTournamentStandings, type TournamentStandings } from "./get-tournament-standings";

/** Prefer an active tournament; otherwise the newest one. */
export async function getCurrentStandings(): Promise<TournamentStandings | null> {
  const supabase = await createSupabaseServerClient();
  const { data: active, error: activeError } = await supabase
    .from("tournaments")
    .select("id")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (activeError) throw activeError;
  if (active) return getTournamentStandings(active.id);

  const { data: latest, error } = await supabase
    .from("tournaments")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!latest) return null;
  return getTournamentStandings(latest.id);
}
