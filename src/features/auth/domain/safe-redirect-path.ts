import type { Route } from "next";

const DEFAULT_PATH: Route = "/";

/**
 * Only same-site paths are allowed after sign-in, so a crafted link
 * can't send someone to another website.
 */
export function toSafeRedirectPath(candidate: unknown): Route {
  if (typeof candidate !== "string") return DEFAULT_PATH;
  if (!candidate.startsWith("/")) return DEFAULT_PATH;
  // "//evil.com" and "/\evil.com" are treated by browsers as other hosts.
  if (candidate.startsWith("//") || candidate.includes("\\")) return DEFAULT_PATH;
  // Checked above at runtime; typed routes can't know which app path it is.
  return candidate as Route;
}
