import { Card } from "@/ui/card";
import { PageHeader } from "@/ui/page-header";

import { playersCopy } from "../copy";
import type { AdminPlayerDetail } from "../queries/get-player-for-admin";
import { ADMIN_PLAYERS_PATH } from "../routes";
import { ClaimLinkPanel } from "./claim-link-panel";
import { PlayerForm } from "./player-form";

type PlayerEditScreenProps = {
  /** Omitted when creating a new player. */
  player?: AdminPlayerDetail;
  claimUrl?: string | null;
};

export function PlayerEditScreen({ player, claimUrl }: PlayerEditScreenProps): React.JSX.Element {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
      <PageHeader
        title={player ? player.name : playersCopy.newPlayerTitle}
        back={{ href: ADMIN_PLAYERS_PATH, label: playersCopy.backToPlayers }}
      />
      <Card>
        <PlayerForm {...(player ? { player } : {})} />
      </Card>
      {player ? (
        <ClaimLinkPanel
          playerId={player.id}
          claimUrl={claimUrl ?? null}
          linkedAccountName={player.linkedAccountName}
        />
      ) : null}
    </main>
  );
}
