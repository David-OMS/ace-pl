import "server-only";

import { syncTournamentStatus } from "@/features/tournaments/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { WorkingTournament } from "../working-tournament";

/** Prefer an active tournament; otherwise newest setup; otherwise newest completed. */
export async function getWorkingTournament(): Promise<WorkingTournament | null> {
  const supabase = await createSupabaseServerClient();
  const newest = await supabase
    .from("tournaments")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (newest.error) throw newest.error;
  if (newest.data) await syncTournamentStatus(supabase, newest.data.id);

  const active = await supabase
    .from("tournaments")
    .select("id, name, status")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (active.error) throw active.error;
  if (active.data) return active.data;

  const setup = await supabase
    .from("tournaments")
    .select("id, name, status")
    .eq("status", "setup")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (setup.error) throw setup.error;
  if (setup.data) return setup.data;

  const completed = await supabase
    .from("tournaments")
    .select("id, name, status")
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (completed.error) throw completed.error;
  return completed.data;
}
