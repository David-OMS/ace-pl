"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { getCurrentUser } from "../queries/get-current-user";
import { displayNameSchema, readDisplayNameForm } from "../schemas/display-name-schema";

export type UpdateDisplayNameState = ActionResult<{ savedAt: number }> | null;

export async function updateDisplayName(
  _previous: UpdateDisplayNameState,
  formData: FormData,
): Promise<UpdateDisplayNameState> {
  const parsed = displayNameSchema.safeParse(readDisplayNameForm(formData));
  if (!parsed.success) return fail("invalid_input");

  const user = await getCurrentUser();
  if (!user) return fail("unauthenticated");

  const displayName = parsed.data.displayName;
  if (displayName === user.displayName) return ok({ savedAt: Date.now() });

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", user.id);

  if (error) {
    logger.error("update_display_name_failed", { userId: user.id, error });
    return fail("save_failed");
  }

  revalidatePath("/profile");
  revalidatePath("/");
  return ok({ savedAt: Date.now() });
}
