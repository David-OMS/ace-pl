import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { AwardsPlayerOption, FraudWatchRow } from "./awards-admin-types";

export type FraudWatchAdmin = {
  open: FraudWatchRow[];
  history: FraudWatchRow[];
  players: AwardsPlayerOption[];
};

/** Fraud Watch is global. It does not wait for a tournament. */
export async function loadFraudWatchAdmin(): Promise<FraudWatchAdmin> {
  const supabase = await createSupabaseServerClient();
  const [fraud, players] = await Promise.all([
    supabase
      .from("fraud_watch_entries")
      .select("id, player_id, caption, started_on, ended_on, players!inner(name)")
      .order("started_on", { ascending: false }),
    supabase.from("players").select("id, name").eq("is_active", true).order("name"),
  ]);

  if (fraud.error) throw fraud.error;
  if (players.error) throw players.error;

  const rows: FraudWatchRow[] = (fraud.data ?? []).map((row) => ({
    id: row.id,
    playerId: row.player_id,
    playerName: row.players.name,
    caption: row.caption,
    startedOn: row.started_on,
    endedOn: row.ended_on,
  }));

  return {
    open: rows.filter((row) => row.endedOn === null),
    history: rows.filter((row) => row.endedOn !== null),
    players: (players.data ?? []).map((player) => ({ id: player.id, name: player.name })),
  };
}
