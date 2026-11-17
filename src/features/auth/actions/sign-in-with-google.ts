"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";

import { publicEnv } from "@/lib/env/public-env";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { buildAuthCallbackUrl } from "../domain/build-auth-callback-url";
import { toSafeRedirectPath } from "../domain/safe-redirect-path";
import { SIGN_IN_ERROR_PARAM, SIGN_IN_PATH } from "../routes";

export async function signInWithGoogle(formData: FormData): Promise<never> {
  const next = toSafeRedirectPath(formData.get("next"));
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: buildAuthCallbackUrl(publicEnv.NEXT_PUBLIC_SITE_URL, next) },
  });

  if (error || !data.url) {
    logger.error("google_sign_in_failed", { error });
    redirect(`${SIGN_IN_PATH}?${SIGN_IN_ERROR_PARAM}=google`);
  }
  // The provider's consent page is outside the app, so typed routes can't check it.
  redirect(data.url as Route);
}
