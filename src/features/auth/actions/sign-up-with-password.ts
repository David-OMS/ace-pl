"use server";

import { redirect } from "next/navigation";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { toAuthFailure } from "../domain/to-auth-failure";
import { passwordSignUpSchema } from "../schemas/email-sign-in-schema";

export type PasswordSignUpState = ActionResult<{ email: string }> | null;

/** Creates the account. A returned email means Supabase still wants a confirm link first. */
export async function signUpWithPassword(
  _previous: PasswordSignUpState,
  formData: FormData,
): Promise<PasswordSignUpState> {
  const parsed = passwordSignUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });
  if (!parsed.success) return fail("invalid_input");

  const { name, email, password, next } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) {
    logger.warn("password_sign_up_failed", { status: error.status, code: error.code });
    return fail(toAuthFailure(error));
  }
  if (!data.session) return ok({ email });
  redirect(next);
}
