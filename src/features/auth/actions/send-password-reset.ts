"use server";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { publicEnv } from "@/lib/env/public-env";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { buildAuthCallbackUrl } from "../domain/build-auth-callback-url";
import { toAuthFailure } from "../domain/to-auth-failure";
import { emailOnlySchema } from "../schemas/email-sign-in-schema";
import { NEW_PASSWORD_PATH } from "../routes";

export type PasswordResetState = ActionResult<{ email: string }> | null;

/** Emails a one-time link. Opening it is what proves they own the inbox. */
export async function sendPasswordReset(
  _previous: PasswordResetState,
  formData: FormData,
): Promise<PasswordResetState> {
  const parsed = emailOnlySchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return fail("invalid_input");

  const { email } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: buildAuthCallbackUrl(publicEnv.NEXT_PUBLIC_SITE_URL, NEW_PASSWORD_PATH),
  });

  if (error) {
    logger.warn("password_reset_failed", { status: error.status, code: error.code });
    return fail(toAuthFailure(error));
  }
  return ok({ email });
}
