import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth";
import {
  ADMIN_PLAYERS_PATH,
  buildClaimUrl,
  getPlayerForAdmin,
  PlayerEditScreen,
  playersCopy,
} from "@/features/players";
import { publicEnv } from "@/lib/env/public-env";

export const metadata: Metadata = { title: playersCopy.editPlayerTitle };

export default async function EditPlayerPage({
  params,
}: PageProps<"/admin/players/[playerId]">): Promise<React.JSX.Element> {
  const { playerId } = await params;
  await requireAdmin(`${ADMIN_PLAYERS_PATH}/${playerId}`);

  const player = await getPlayerForAdmin(playerId);
  if (!player) notFound();

  const claimUrl = player.claimToken
    ? buildClaimUrl(publicEnv.NEXT_PUBLIC_SITE_URL, player.claimToken)
    : null;
  return <PlayerEditScreen player={player} claimUrl={claimUrl} />;
}
