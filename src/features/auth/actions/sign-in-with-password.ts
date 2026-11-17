"use server";

import { redirect } from "next/navigation";

import { fail, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { toAuthFailure } from "../domain/to-auth-failure";
import { passwordSignInSchema } from "../schemas/email-sign-in-schema";

export type PasswordSignInState = ActionResult<never> | null;

export async function signInWithPassword(
  _previous: PasswordSignInState,
  formData: FormData,
): Promise<PasswordSignInState> {
  const parsed = passwordSignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });
  if (!parsed.success) return fail("invalid_input");

  const { email, password, next } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    logger.warn("password_sign_in_failed", { status: error.status, code: error.code });
    return fail(toAuthFailure(error));
  }
  redirect(next);
}
