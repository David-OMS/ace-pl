import "server-only";

import { playerPhotoUrl } from "@/lib/players/player-photo-url";
import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

export type HomeFraudWatchEntry = {
  id: string;
  subjectName: string;
  photoUrl: string | null;
  teamColor: string | null;
  kind: "player" | "team";
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
    .select("id, caption, player_id, team_id, players(name, photo_path), teams(name, color)")
    .is("ended_on", null)
    .order("started_on", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => {
    if (row.team_id && row.teams) {
      return {
        id: row.id,
        subjectName: row.teams.name,
        photoUrl: null,
        teamColor: row.teams.color,
        kind: "team" as const,
        caption: row.caption,
      };
    }
    return {
      id: row.id,
      subjectName: row.players?.name ?? "?",
      photoUrl: playerPhotoUrl(row.players?.photo_path ?? null),
      teamColor: null,
      kind: "player" as const,
      caption: row.caption,
    };
  });
}
