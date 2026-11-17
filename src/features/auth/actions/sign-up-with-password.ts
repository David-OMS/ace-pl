"use server";

import { redirect } from "next/navigation";

import { fail, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { toAuthFailure } from "../domain/to-auth-failure";
import { passwordSignUpSchema } from "../schemas/email-sign-in-schema";

export type PasswordSignUpState = ActionResult<never> | null;

/** Creates the account with no confirm email, then signs them in. */
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
  const admin = createSupabaseAdminClient();
  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  });

  if (created.error) {
    logger.warn("password_sign_up_failed", {
      status: created.error.status,
      code: created.error.code,
    });
    return fail(toAuthFailure(created.error));
  }

  const supabase = await createSupabaseServerClient();
  const signedIn = await supabase.auth.signInWithPassword({ email, password });
  if (signedIn.error) {
    logger.warn("password_sign_up_session_failed", {
      status: signedIn.error.status,
      code: signedIn.error.code,
    });
    return fail(toAuthFailure(signedIn.error));
  }
  redirect(next);
}
