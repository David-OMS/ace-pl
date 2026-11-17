"use server";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { publicEnv } from "@/lib/env/public-env";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { buildAuthCallbackUrl } from "../domain/build-auth-callback-url";
import { emailSignInSchema } from "../schemas/email-sign-in-schema";

export type MagicLinkState = ActionResult<{ email: string }> | null;

const RATE_LIMIT_STATUS = 429;

export async function sendMagicLink(
  _previous: MagicLinkState,
  formData: FormData,
): Promise<MagicLinkState> {
  const parsed = emailSignInSchema.safeParse({
    email: formData.get("email"),
    next: formData.get("next"),
  });
  if (!parsed.success) return fail("invalid_input");

  const { email, next } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: buildAuthCallbackUrl(publicEnv.NEXT_PUBLIC_SITE_URL, next) },
  });

  if (error) {
    logger.warn("magic_link_send_failed", { status: error.status, error });
    return fail(error.status === RATE_LIMIT_STATUS ? "rate_limited" : "request_failed");
  }
  return ok({ email });
}
