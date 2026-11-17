import { claimPath } from "../routes";

/** The link an admin sends a player so they can attach their account to their player profile. */
export function buildClaimUrl(siteUrl: string, token: string): string {
  return new URL(claimPath(token), siteUrl).toString();
}
