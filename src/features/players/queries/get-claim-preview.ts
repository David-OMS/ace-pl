import "server-only";

import { z } from "zod";

import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

/**
 * Player name for an unused claim link, or null when the link is dead.
 * The token table is hidden from the public, so this never returns the token.
 */
export async function getClaimPreview(token: string): Promise<string | null> {
  if (!z.uuid().safeParse(token).success) return null;

  const fromFunction = await nameFromPreviewClaim(token);
  if (fromFunction !== "unavailable") return fromFunction;
  return nameFromClaimToken(token);
}

/** Uses the public function once it is deployed. "unavailable" means the migration is not on yet. */
async function nameFromPreviewClaim(token: string): Promise<string | null | "unavailable"> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase.rpc("preview_claim", { claim_token: token });
  if (error?.code === "PGRST202") return "unavailable";
  if (error) throw error;
  return data;
}

async function nameFromClaimToken(token: string): Promise<string | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("player_claim_tokens")
    .select("players!inner(name, profile_id)")
    .eq("token", token)
    .maybeSingle();
  if (error) throw error;
  if (!data || data.players.profile_id !== null) return null;
  return data.players.name;
}
