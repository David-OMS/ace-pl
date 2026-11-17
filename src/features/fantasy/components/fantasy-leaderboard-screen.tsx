import Link from "next/link";

import { Card } from "@/ui/card";
import { PageHeader } from "@/ui/page-header";

import { fantasyCopy } from "../copy";
import type { FantasyLeaderboardRow } from "../queries/list-fantasy-leaderboard";
import { fantasyTeamPath, FANTASY_PATH } from "../routes";
import { FantasyTheme } from "./fantasy-theme";

type FantasyLeaderboardScreenProps = {
  rows: readonly FantasyLeaderboardRow[];
  highlightUserId?: string;
};

export function FantasyLeaderboardScreen({
  rows,
  highlightUserId,
}: FantasyLeaderboardScreenProps): React.JSX.Element {
  return (
    <FantasyTheme className="flex flex-col gap-4 px-4 py-4 pb-8">
      <PageHeader
        title={fantasyCopy.leaderboard}
        back={{ href: FANTASY_PATH, label: fantasyCopy.title }}
      />
      {rows.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">{fantasyCopy.leaderboardEmpty}</p>
        </Card>
      ) : (
        <Card className="flex flex-col p-0">
          {rows.map((row) => (
            <Link
              key={row.teamId}
              href={fantasyTeamPath(row.teamId)}
              className={`flex items-center gap-3 border-b border-line-soft px-3 py-2 last:border-b-0 ${
                row.userId === highlightUserId ? "bg-surface-alt" : ""
              }`}
            >
              <span className="w-6 font-display text-muted">{row.rank}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{row.teamName}</p>
                <p className="truncate text-xs text-muted">{row.ownerName}</p>
              </div>
              <span className="font-display text-lg">{row.totalPoints}</span>
            </Link>
          ))}
        </Card>
      )}
    </FantasyTheme>
  );
}
