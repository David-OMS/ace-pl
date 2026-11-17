"use server";

import { revalidatePath } from "next/cache";

import { PLAYER_PHOTO_BUCKET } from "@/config/fantasy";
import { getCurrentUser } from "@/features/auth";
import { FAN_PLAYERS_PATH, FAN_PROFILE_PATH } from "@/features/fan";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { revalidateFanPublic } from "@/lib/cache/fan-public-cache";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type UploadPhotoState = ActionResult<{ savedAt: number }> | null;

const MAX_BYTES = 2 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function acceptedPhoto(formData: FormData): { file: File; extension: string } | null {
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0 || file.size > MAX_BYTES) return null;
  const extension = EXTENSIONS[file.type];
  if (!extension) return null;
  return { file, extension };
}

/** Stores a picture for the signed-in player's own profile. */
export async function uploadMyPlayerPhoto(
  _previous: UploadPhotoState,
  formData: FormData,
): Promise<UploadPhotoState> {
  const user = await getCurrentUser();
  if (!user) return fail("unauthenticated");

  const photo = acceptedPhoto(formData);
  if (!photo) return fail("invalid_input");
  const { file, extension } = photo;

  const supabase = await createSupabaseServerClient();
  const { data: player, error: playerError } = await supabase
    .from("players")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();
  if (playerError) throw playerError;
  if (!player) return fail("not_found");

  const path = `${player.id}/${crypto.randomUUID()}.${extension}`;
  const body = new Uint8Array(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(PLAYER_PHOTO_BUCKET)
    .upload(path, body, { contentType: file.type, upsert: false });
  if (uploadError) {
    logger.error("player_photo_upload_failed", { error: uploadError });
    return fail("save_failed");
  }

  const { error } = await supabase.rpc("set_my_player_photo", { new_photo_path: path });
  if (error) {
    logger.error("player_photo_save_failed", { error });
    return fail("save_failed");
  }

  revalidatePath(FAN_PROFILE_PATH);
  revalidatePath(FAN_PLAYERS_PATH);
  revalidateFanPublic();
  return ok({ savedAt: Date.now() });
}
