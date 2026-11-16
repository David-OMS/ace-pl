import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { publicEnv } from "@/lib/env/public-env";
import { serverEnv } from "@/lib/env/server-env";
import type { Database } from "@/types/database";

/**
 * Bypasses Row Level Security. Only for trusted server jobs (cron, push delivery),
 * never for requests acting on behalf of a user.
 */
export function createSupabaseAdminClient(): SupabaseClient<Database> {
  return createClient<Database>(publicEnv.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
