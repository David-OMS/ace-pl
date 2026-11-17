import { Card } from "@/ui/card";
import { PageHeader } from "@/ui/page-header";

import { tournamentsCopy } from "../copy";
import type { TournamentDetail } from "../queries/get-tournament";
import { adminTournamentPath } from "../routes";
import { RosterPlayerPicker, type RosterPickPlayer } from "./roster-player-picker";

type TournamentPlayersScreenProps = {
  tournament: TournamentDetail;
  players: readonly RosterPickPlayer[];
  next: "teams" | "hub";
};

export function TournamentPlayersScreen({
  tournament,
  players,
  next,
}: TournamentPlayersScreenProps): React.JSX.Element {
  const copy = tournamentsCopy.workspace;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
      <PageHeader
        title={copy.rosterTitle}
        back={{ href: adminTournamentPath(tournament.id), label: tournament.name }}
      />
      <p className="text-sm text-muted">{copy.rosterIntro}</p>
      <Card>
        <RosterPlayerPicker
          key={[...tournament.rosterPlayerIds].sort().join(",")}
          tournamentId={tournament.id}
          players={players}
          initialSelectedIds={tournament.rosterPlayerIds}
          next={next}
        />
      </Card>
    </main>
  );
}
