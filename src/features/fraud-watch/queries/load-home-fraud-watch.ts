import "server-only";

import { playerPhotoUrl } from "@/lib/players/player-photo-url";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type HomeFraudWatchEntry = {
  id: string;
  playerName: string;
  photoUrl: string | null;
  caption: string | null;
};

/** Open Fraud Watch rows for the fan home strip. */
export async function loadHomeFraudWatch(tournamentId: string): Promise<HomeFraudWatchEntry[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("fraud_watch_entries")
    .select("id, caption, players!inner(name, photo_path)")
    .eq("tournament_id", tournamentId)
    .is("ended_on", null)
    .order("started_on", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    playerName: row.players.name,
    photoUrl: playerPhotoUrl(row.players.photo_path),
    caption: row.caption,
  }));
}
