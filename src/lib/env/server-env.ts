import "server-only";

import { z } from "zod";

const optionalString = z
  .string()
  .optional()
  .transform((value) => (value === "" ? undefined : value));

const serverEnvSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1),
  SUPABASE_PROJECT_REF: z.string().min(1),
  /** Only this user id may open or edit global fantasy prices. */
  FANTASY_PRICE_ADMIN_ID: z.string().uuid(),
  VAPID_PRIVATE_KEY: optionalString,
  VAPID_SUBJECT: optionalString,
  CRON_SECRET: optionalString,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const serverEnv: ServerEnv = serverEnvSchema.parse(process.env);
