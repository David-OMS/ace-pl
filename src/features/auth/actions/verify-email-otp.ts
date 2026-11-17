"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { nextFromRedirectTarget } from "../domain/safe-redirect-path";
import { SIGN_IN_ERROR_PARAM, SIGN_IN_PATH } from "../routes";

const FAILED = `${SIGN_IN_PATH}?${SIGN_IN_ERROR_PARAM}=link`;

type OtpType = "email" | "recovery";

type OtpArgs =
  { token_hash: string; type: OtpType } | { email: string; token: string; type: "email" };

/** Confirms a magic-link or password-reset token. The email link only opens the page; this runs on tap. */
export async function verifyEmailOtp(formData: FormData): Promise<void> {
  const next = nextFromRedirectTarget(formData.get("next") ?? formData.get("redirect_to"));
  const args = otpArgs(formData);
  if (!args) redirect(FAILED);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp(args);
  if (error) redirect(FAILED);
  redirect(next);
}

function otpArgs(formData: FormData): OtpArgs | null {
  const tokenHash = text(formData.get("token_hash"));
  if (tokenHash) return { token_hash: tokenHash, type: otpType(formData.get("type")) };

  const email = text(formData.get("email"));
  const token = text(formData.get("token"));
  if (!email || !token) return null;
  return { email, token, type: "email" };
}

function otpType(value: FormDataEntryValue | null): OtpType {
  return value === "recovery" ? "recovery" : "email";
}

function text(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}
