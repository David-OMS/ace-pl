import "server-only";

import type { ActionErrorCode } from "@/lib/action-result";

import { getCurrentUser } from "../queries/get-current-user";

/** Server action guard. Returns the error to send back, or null when the caller is an admin. */
export async function checkAdminAccess(): Promise<ActionErrorCode | null> {
  const user = await getCurrentUser();
  if (!user) return "unauthenticated";
  return user.isAdmin ? null : "forbidden";
}
