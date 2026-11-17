import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { publicEnv } from "@/lib/env/public-env";
import type { Database } from "@/types/database";

/**
 * Anon client with no cookies. Cached fan reads must not touch the request session,
 * and these tables are already public to anon under RLS.
 */
export function createPublicSupabaseClient(): SupabaseClient<Database> {
  return createClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
