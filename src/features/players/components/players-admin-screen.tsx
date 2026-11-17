import { UserPlus } from "lucide-react";

import { ButtonLink } from "@/ui/button-link";
import { Icon } from "@/ui/icon";
import { PageHeader } from "@/ui/page-header";

import { playersCopy } from "../copy";
import type { PlayerSummary } from "../queries/list-players";
import { NEW_PLAYER_PATH } from "../routes";
import { PlayerList } from "./player-list";

type PlayersAdminScreenProps = { players: readonly PlayerSummary[] };

export function PlayersAdminScreen({ players }: PlayersAdminScreenProps): React.JSX.Element {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
      <PageHeader
        title={playersCopy.adminTitle}
        action={
          <ButtonLink href={NEW_PLAYER_PATH}>
            <Icon icon={UserPlus} size="sm" />
            {playersCopy.addPlayer}
          </ButtonLink>
        }
      />
      <PlayerList players={players} />
    </main>
  );
}
