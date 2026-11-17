import "server-only";

import { FANTASY_DEFAULT_BUDGET, FANTASY_SQUAD_SIZE } from "@/config/fantasy";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type FanTournament = {
  id: string;
  name: string;
  status: string;
  squadSize: number;
  fantasySquadSize: number;
  fantasyBudget: number;
  playersOnPitch: number;
};

/** Prefer active; else newest completed; else newest any. */
export async function resolveFanTournament(): Promise<FanTournament | null> {
  const supabase = await createSupabaseServerClient();
  const active = await supabase
    .from("tournaments")
    .select("id, name, status, squad_size, players_on_pitch, fantasy_budget")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (active.error) throw active.error;
  if (active.data) return mapTournament(active.data);

  const latest = await supabase
    .from("tournaments")
    .select("id, name, status, squad_size, players_on_pitch, fantasy_budget")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (latest.error) throw latest.error;
  if (!latest.data) return null;
  return mapTournament(latest.data);
}

function mapTournament(row: {
  id: string;
  name: string;
  status: string;
  squad_size: number;
  players_on_pitch: number;
  fantasy_budget: number | null;
}): FanTournament {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    squadSize: row.squad_size,
    fantasySquadSize: FANTASY_SQUAD_SIZE,
    fantasyBudget: Number(row.fantasy_budget ?? FANTASY_DEFAULT_BUDGET),
    playersOnPitch: row.players_on_pitch,
  };
}
