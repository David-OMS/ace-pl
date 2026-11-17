import type { Metadata } from "next";

import { getCurrentUser } from "@/features/auth";
import { ClaimPlayerScreen, getClaimPreview, playersCopy } from "@/features/players";

export const metadata: Metadata = { title: playersCopy.claimPage.title };

export default async function ClaimPlayerPage({
  params,
}: PageProps<"/claim/[token]">): Promise<React.JSX.Element> {
  const { token } = await params;
  const [playerName, user] = await Promise.all([getClaimPreview(token), getCurrentUser()]);

  return (
    <ClaimPlayerScreen
      token={token}
      playerName={playerName}
      needsSignUp={playerName !== null && !user}
    />
  );
}
