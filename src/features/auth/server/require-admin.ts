import "server-only";

import { notFound, redirect } from "next/navigation";

import { getCurrentUser, type CurrentUser } from "../queries/get-current-user";
import { buildSignInHref } from "../routes";

/** Page guard. Visitors go to sign-in; signed-in non-admins get a 404 so admin pages stay hidden. */
export async function requireAdmin(returnPath: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(buildSignInHref(returnPath));
  if (!user.isAdmin) notFound();
  return user;
}
