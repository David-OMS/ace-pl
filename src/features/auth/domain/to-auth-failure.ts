import type { ActionErrorCode } from "@/lib/action-result";

type AuthFailureInput = {
  status?: number | undefined;
  code?: string | undefined;
};

const INVALID_CODES = new Set(["invalid_credentials", "weak_password", "validation_failed"]);

/** Maps a Supabase auth error onto the codes the forms already know how to explain. */
export function toAuthFailure(error: AuthFailureInput): ActionErrorCode {
  if (error.status === 429 || error.code === "over_request_rate_limit") return "rate_limited";
  if (error.code === "user_already_exists") return "conflict";
  if ((error.code && INVALID_CODES.has(error.code)) || error.status === 400) return "invalid_input";
  return "request_failed";
}
