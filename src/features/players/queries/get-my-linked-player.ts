import "server-only";

import { playerPhotoUrl } from "@/lib/players/player-photo-url";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type LinkedPlayer = {
  id: string;
  name: string;
  photoUrl: string | null;
};

/** The player profile tied to this account, if they have claimed one. */
export async function getMyLinkedPlayer(userId: string): Promise<LinkedPlayer | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, name, photo_path")
    .eq("profile_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    photoUrl: playerPhotoUrl(data.photo_path),
  };
}
