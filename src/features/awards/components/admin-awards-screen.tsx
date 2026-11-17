import { PageHeader } from "@/ui/page-header";

import { awardsCopy } from "../copy";
import type { AwardsAdminSnapshot } from "../queries/awards-admin-types";
import { AdminAwardsAuto } from "./admin-awards-auto";
import { AdminAwardsBaller } from "./admin-awards-baller";
import { AdminAwardsFraud } from "./admin-awards-fraud";

type AdminAwardsScreenProps = {
  snapshot: AwardsAdminSnapshot | null;
  title: string;
};

export function AdminAwardsScreen({ snapshot, title }: AdminAwardsScreenProps): React.JSX.Element {
  if (!snapshot) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pb-4">
        <PageHeader title={title} />
        <p className="text-sm text-muted">{awardsCopy.noTournament}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pb-4">
      <PageHeader title={title} />
      <p className="text-xs font-bold text-muted uppercase">{snapshot.tournamentName}</p>
      <AdminAwardsFraud
        tournamentId={snapshot.tournamentId}
        open={snapshot.fraudOpen}
        history={snapshot.fraudHistory}
        roster={snapshot.roster}
      />
      <AdminAwardsBaller
        tournamentId={snapshot.tournamentId}
        tournamentName={snapshot.tournamentName}
        preview={snapshot.shortlistPreview}
        ballon={snapshot.ballon}
      />
      <AdminAwardsAuto awards={snapshot.autoAwards} />
    </main>
  );
}
