import { Card } from "@/ui/card";
import { PageHeader } from "@/ui/page-header";
import { SoftNavLink } from "@/ui/soft-nav-link";

import { fantasyCopy } from "../copy";
import type { FantasyLeaderboardRow } from "../queries/list-fantasy-leaderboard";
import { fantasyTeamPath, FANTASY_PATH } from "../routes";
import { FantasyTheme } from "./fantasy-theme";

type FantasyLeaderboardScreenProps = {
  rows: readonly FantasyLeaderboardRow[];
  highlightUserId?: string;
  /** Other teams only open after a gameweek is locked. */
  canOpenOtherSquads: boolean;
};

export function FantasyLeaderboardScreen({
  rows,
  highlightUserId,
  canOpenOtherSquads,
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
            <LeaderboardRow
              key={row.teamId}
              row={row}
              highlight={row.userId === highlightUserId}
              openable={canOpenOtherSquads || row.userId === highlightUserId}
            />
          ))}
        </Card>
      )}
    </FantasyTheme>
  );
}

function LeaderboardRow(args: {
  row: FantasyLeaderboardRow;
  highlight: boolean;
  openable: boolean;
}): React.JSX.Element {
  const className = `flex items-center gap-3 border-b border-line-soft px-3 py-2 last:border-b-0 ${
    args.highlight ? "bg-surface-alt" : ""
  }`;
  const body = (
    <>
      <span className="w-6 font-display text-muted">{args.row.rank}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">{args.row.teamName}</p>
        <p className="truncate text-xs text-muted">{args.row.ownerName}</p>
      </div>
      <span className="font-display text-lg">{args.row.totalPoints}</span>
    </>
  );
  if (!args.openable) {
    return <div className={className}>{body}</div>;
  }
  const href = args.highlight && args.row.userId ? FANTASY_PATH : fantasyTeamPath(args.row.teamId);
  return (
    <SoftNavLink href={href} className={className}>
      {body}
    </SoftNavLink>
  );
}
