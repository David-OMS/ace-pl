export const AUTH_CALLBACK_PATH = "/auth/callback";

/** The URL Supabase sends people back to after a magic link or Google sign-in. */
export function buildAuthCallbackUrl(siteUrl: string, nextPath: string): string {
  const url = new URL(AUTH_CALLBACK_PATH, siteUrl);
  url.searchParams.set("next", nextPath);
  return url.toString();
}
