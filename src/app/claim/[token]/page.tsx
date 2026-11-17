import type { Metadata } from "next";

import { buildSignInHref, getCurrentUser } from "@/features/auth";
import { claimPath, ClaimPlayerScreen, playersCopy } from "@/features/players";

export const metadata: Metadata = { title: playersCopy.claimPage.title };

export default async function ClaimPlayerPage({
  params,
}: PageProps<"/claim/[token]">): Promise<React.JSX.Element> {
  const { token } = await params;
  const user = await getCurrentUser();
  const signInHref = user ? null : buildSignInHref(claimPath(token));
  return <ClaimPlayerScreen token={token} signInHref={signInHref} />;
}
