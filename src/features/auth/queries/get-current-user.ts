import "server-only";

import { cache } from "react";

import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type CurrentUser = {
  id: string;
  displayName: string;
  isAdmin: boolean;
};

function displayNameFromClaims(claims: Record<string, unknown>): string {
  const meta = claims.user_metadata;
  if (meta && typeof meta === "object") {
    const record = meta as Record<string, unknown>;
    for (const key of ["full_name", "name"] as const) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return value.trim().slice(0, 40);
    }
  }
  if (typeof claims.email === "string" && claims.email.includes("@")) {
    const localPart = claims.email.split("@")[0];
    if (localPart) return localPart.slice(0, 40);
  }
  return "Player";
}

/** The signed-in user's profile, or null for visitors. Cached for the length of one request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId || !claims) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, is_admin")
    .eq("id", userId)
    .maybeSingle();

  if (!error && data) {
    return { id: data.id, displayName: data.display_name, isAdmin: data.is_admin };
  }

  // Auth can be fine while the Data API is down (PGRST002). Keep the session usable.
  if (error) {
    logger.warn("get_current_user_profile_unavailable", {
      userId,
      code: "code" in error ? error.code : undefined,
    });
  }
  return { id: userId, displayName: displayNameFromClaims(claims), isAdmin: false };
});
