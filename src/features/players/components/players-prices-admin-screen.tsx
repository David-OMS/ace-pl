import { PageHeader } from "@/ui/page-header";

import { playersCopy } from "../copy";
import { PlayersAdminTabs } from "./players-admin-tabs";

type PlayersPricesAdminScreenProps = { children: React.ReactNode };

export function PlayersPricesAdminScreen({
  children,
}: PlayersPricesAdminScreenProps): React.JSX.Element {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
      <PageHeader title={playersCopy.pricesTitle} />
      <PlayersAdminTabs active="prices" />
      {children}
    </main>
  );
}
