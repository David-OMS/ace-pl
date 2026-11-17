import { Card } from "@/ui/card";
import { PageHeader } from "@/ui/page-header";

import { tournamentsCopy } from "../copy";
import type { TournamentDetail } from "../queries/get-tournament";
import { adminTournamentPath } from "../routes";
import { DeleteTournamentButton } from "./delete-tournament-button";
import { GameDaysPanel } from "./game-days-panel";
import { TournamentForm } from "./tournament-form";

type TournamentSettingsScreenProps = {
  tournament: TournamentDetail;
};

export function TournamentSettingsScreen({
  tournament,
}: TournamentSettingsScreenProps): React.JSX.Element {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
      <PageHeader
        title={tournamentsCopy.settingsTitle}
        back={{
          href: adminTournamentPath(tournament.id),
          label: tournament.name,
        }}
      />
      <p className="text-sm text-muted">
        {tournamentsCopy.statuses[tournament.status]} — {tournamentsCopy.statusAutoHint}
      </p>
      <Card className="flex flex-col gap-3">
        <TournamentForm tournament={tournament} />
      </Card>
      <GameDaysPanel tournamentId={tournament.id} gameDays={tournament.gameDays} />
      <Card className="flex flex-col gap-3">
        <DeleteTournamentButton tournamentId={tournament.id} />
      </Card>
    </main>
  );
}
