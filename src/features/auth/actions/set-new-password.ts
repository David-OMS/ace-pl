"use server";

import { redirect } from "next/navigation";

import { fail, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { toAuthFailure } from "../domain/to-auth-failure";
import { newPasswordSchema } from "../schemas/email-sign-in-schema";

export type NewPasswordState = ActionResult<never> | null;

/** Saves the password after the reset link has already signed them in. */
export async function setNewPassword(
  _previous: NewPasswordState,
  formData: FormData,
): Promise<NewPasswordState> {
  const parsed = newPasswordSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) return fail("invalid_input");

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return fail("unauthenticated");

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    logger.warn("password_update_failed", { status: error.status, code: error.code });
    return fail(toAuthFailure(error));
  }
  redirect("/");
}
