import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";

/** Scoring writes are a system job — bypass RLS so totals stay consistent for everyone. */
export function fantasyScoringDb() {
  return createSupabaseAdminClient();
}
