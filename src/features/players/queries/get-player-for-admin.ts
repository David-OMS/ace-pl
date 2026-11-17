import "server-only";

import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { PlayerSummary } from "./list-players";

export type AdminPlayerDetail = PlayerSummary & {
  linkedAccountName: string | null;
  /** Null once the player has been claimed, because claiming uses up the token. */
  claimToken: string | null;
};

export async function getPlayerForAdmin(playerId: string): Promise<AdminPlayerDetail | null> {
  if (!z.uuid().safeParse(playerId).success) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("players")
    .select(
      "id, name, position, is_active, profile_id, profiles(display_name), player_claim_tokens(token)",
    )
    .eq("id", playerId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    position: data.position,
    isActive: data.is_active,
    isClaimed: data.profile_id !== null,
    linkedAccountName: data.profiles?.display_name ?? null,
    claimToken: data.player_claim_tokens?.token ?? null,
  };
}
