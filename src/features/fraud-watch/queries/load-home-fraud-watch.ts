import "server-only";

import { playerPhotoUrl } from "@/lib/players/player-photo-url";
import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

export type HomeFraudWatchEntry = {
  id: string;
  playerName: string;
  photoUrl: string | null;
  caption: string | null;
};

/** Open Fraud Watch rows for the fan home strip. Not tied to a tournament. */
export function loadHomeFraudWatch(): Promise<HomeFraudWatchEntry[]> {
  return fanPublicCache("home-fraud", readHomeFraudWatch);
}

async function readHomeFraudWatch(): Promise<HomeFraudWatchEntry[]> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("fraud_watch_entries")
    .select("id, caption, players!inner(name, photo_path)")
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
