import { PageHeader } from "@/ui/page-header";

import { awardsCopy } from "../copy";
import type { AwardsAdminSnapshot } from "../queries/awards-admin-types";
import type { FraudWatchAdmin } from "../queries/load-fraud-watch-admin";
import { AdminAwardsAuto } from "./admin-awards-auto";
import { AdminAwardsBaller } from "./admin-awards-baller";
import { AdminAwardsFraud } from "./admin-awards-fraud";

type AdminAwardsScreenProps = {
  fraud: FraudWatchAdmin;
  snapshot: AwardsAdminSnapshot | null;
  title: string;
};

export function AdminAwardsScreen({
  fraud,
  snapshot,
  title,
}: AdminAwardsScreenProps): React.JSX.Element {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pb-4">
      <PageHeader title={title} />
      {snapshot ? (
        <p className="text-xs font-bold text-muted uppercase">{snapshot.tournamentName}</p>
      ) : null}
      <AdminAwardsFraud open={fraud.open} history={fraud.history} roster={fraud.players} />
      {snapshot ? (
        <>
          <AdminAwardsBaller
            tournamentId={snapshot.tournamentId}
            tournamentName={snapshot.tournamentName}
            preview={snapshot.shortlistPreview}
            ballon={snapshot.ballon}
          />
          <AdminAwardsAuto awards={snapshot.autoAwards} />
        </>
      ) : (
        <p className="text-sm text-muted">{awardsCopy.awardsNeedTournament}</p>
      )}
    </main>
  );
}
