import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth";
import { FantasyRanksAdminScreen, listPricedPlayersForAdmin } from "@/features/fantasy";
import {
  ADMIN_PLAYER_PRICES_PATH,
  PlayersPricesAdminScreen,
  playersCopy,
} from "@/features/players";

export const metadata: Metadata = { title: playersCopy.pricesTitle };

export default async function AdminPlayerPricesPage(): Promise<React.JSX.Element> {
  await requireAdmin(ADMIN_PLAYER_PRICES_PATH);
  const players = await listPricedPlayersForAdmin();

  return (
    <PlayersPricesAdminScreen>
      <FantasyRanksAdminScreen players={players} />
    </PlayersPricesAdminScreen>
  );
}
