import { z } from "zod";

import { toSafeRedirectPath } from "../domain/safe-redirect-path";

export const emailSignInSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
  next: z.unknown().transform(toSafeRedirectPath),
});

export type EmailSignInInput = z.infer<typeof emailSignInSchema>;
