import { AUTH_CALLBACK_PATH } from "./build-auth-callback-url";
import { NEW_PASSWORD_PATH, SIGN_IN_NEXT_PARAM } from "../routes";

/**
 * Supabase falls back to the site root when the reset address is not allowed.
 * The login code is then sitting on the home page. Send it through the callback.
 */
export function forwardAuthCode(current: URL, isPasswordReset: boolean): URL | null {
  if (!isPasswordReset) return null;
  const code = current.searchParams.get("code");
  if (!code || current.pathname === AUTH_CALLBACK_PATH) return null;

  const callback = new URL(AUTH_CALLBACK_PATH, current.origin);
  callback.searchParams.set("code", code);
  callback.searchParams.set(SIGN_IN_NEXT_PARAM, NEW_PASSWORD_PATH);
  return callback;
}
