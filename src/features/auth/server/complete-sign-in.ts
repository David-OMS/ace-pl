import "server-only";

import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { toSafeRedirectPath } from "../domain/safe-redirect-path";
import { SIGN_IN_ERROR_PARAM, SIGN_IN_PATH } from "../routes";

const FAILED_SIGN_IN_PATH = `${SIGN_IN_PATH}?${SIGN_IN_ERROR_PARAM}=link`;

/** Swaps the one-time code from the email or Google for a session. Returns where to go next. */
export async function completeSignIn(code: string | null, next: unknown): Promise<string> {
  if (!code) return FAILED_SIGN_IN_PATH;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    logger.warn("auth_code_exchange_failed", { error });
    return FAILED_SIGN_IN_PATH;
  }
  return toSafeRedirectPath(next);
}
