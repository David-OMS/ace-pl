import { Card } from "@/ui/card";
import { PageHeader } from "@/ui/page-header";

import { tournamentsCopy } from "../copy";
import { ADMIN_TOURNAMENTS_PATH } from "../routes";
import { TournamentForm } from "./tournament-form";

export function TournamentCreateScreen(): React.JSX.Element {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
      <PageHeader
        title={tournamentsCopy.newTournament}
        back={{ href: ADMIN_TOURNAMENTS_PATH, label: tournamentsCopy.backToTournaments }}
      />
      <Card className="flex flex-col gap-3">
        <TournamentForm />
      </Card>
    </main>
  );
}
