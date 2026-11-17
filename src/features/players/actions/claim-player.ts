"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { fail, type ActionErrorCode, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type ClaimPlayerState = ActionResult<never> | null;

const claimTokenSchema = z.uuid();

/** Error names raised by the `claim_player` database function. */
const CLAIM_ERRORS: Record<string, ActionErrorCode> = {
  not_authenticated: "unauthenticated",
  already_linked: "conflict",
  invalid_claim_token: "not_found",
};

export async function claimPlayer(
  _previous: ClaimPlayerState,
  formData: FormData,
): Promise<ClaimPlayerState> {
  const token = claimTokenSchema.safeParse(formData.get("token"));
  if (!token.success) return fail("not_found");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("claim_player", { claim_token: token.data });

  if (error) {
    const code = CLAIM_ERRORS[error.message];
    if (!code) logger.error("claim_player_failed", { error });
    return fail(code ?? "save_failed");
  }
  redirect("/");
}
