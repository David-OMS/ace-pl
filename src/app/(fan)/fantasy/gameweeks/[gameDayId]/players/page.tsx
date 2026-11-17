import type { Metadata } from "next";
import type { Route } from "next";

import { FantasyTheme, fantasyCopy, listGameDayTopPlayers, FANTASY_PATH } from "@/features/fantasy";
import { PageHeader } from "@/ui/page-header";
import { Card } from "@/ui/card";

export const metadata: Metadata = { title: fantasyCopy.gwPlayersTitle };

type PageProps = {
  params: Promise<{ gameDayId: string }>;
};

export default async function FantasyGwPlayersPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { gameDayId } = await params;
  const rows = await listGameDayTopPlayers(gameDayId);

  return (
    <FantasyTheme className="flex flex-col gap-4 px-4 py-4 pb-8">
      <PageHeader
        title={fantasyCopy.gwPlayersTitle}
        back={{
          href: `${FANTASY_PATH}?gw=${gameDayId}` as Route,
          label: fantasyCopy.title,
        }}
      />
      {rows.length === 0 ? (
        <p className="text-sm text-muted">{fantasyCopy.gwPlayersEmpty}</p>
      ) : (
        <Card className="flex flex-col p-0">
          {rows.map((row, index) => (
            <div
              key={row.playerId}
              className="flex items-center gap-3 border-b border-line-soft px-3 py-2 last:border-b-0"
            >
              <span className="w-6 font-display text-muted">{index + 1}</span>
              <p className="min-w-0 flex-1 truncate font-bold">{row.name}</p>
              <span className="font-display text-lg">{row.points}</span>
            </div>
          ))}
        </Card>
      )}
    </FantasyTheme>
  );
}
