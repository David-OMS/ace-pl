import { PLAYER_PHOTO_BUCKET } from "@/config/fantasy";
import { publicEnv } from "@/lib/env/public-env";

/** Public storage URL for a player photo path, or null when unset. */
export function playerPhotoUrl(photoPath: string | null | undefined): string | null {
  if (!photoPath) return null;
  const base = publicEnv.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${PLAYER_PHOTO_BUCKET}/${photoPath}`;
}
