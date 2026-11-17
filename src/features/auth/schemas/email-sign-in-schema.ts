import { z } from "zod";

import { isUsablePassword } from "../domain/password-length";
import { toSafeRedirectPath } from "../domain/safe-redirect-path";

const emailField = z.string().trim().toLowerCase().pipe(z.email().max(254));

export const emailOnlySchema = z.object({
  email: emailField,
});

export const emailSignInSchema = z.object({
  email: emailField,
  next: z.unknown().transform(toSafeRedirectPath),
});

const passwordField = z.string().refine(isUsablePassword);

export const passwordSignInSchema = emailSignInSchema.extend({
  password: passwordField,
});

export const passwordSignUpSchema = passwordSignInSchema.extend({
  name: z.string().trim().min(1).max(40),
});

export const newPasswordSchema = z.object({
  password: passwordField,
});

export type EmailSignInInput = z.infer<typeof emailSignInSchema>;
