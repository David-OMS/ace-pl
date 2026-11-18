import { Card } from "@/ui/card";
import { SoftNavLink } from "@/ui/soft-nav-link";

import { fantasyCopy } from "../copy";
import type { FantasyLeaderboardRow } from "../queries/list-fantasy-leaderboard";
import { fantasyTeamPath, FANTASY_LEADERBOARD_PATH, FANTASY_PATH } from "../routes";

const TOP = 5;

type FantasyLeaderboardMiniProps = {
  rows: readonly FantasyLeaderboardRow[];
  highlightUserId?: string;
};

export function FantasyLeaderboardMini({
  rows,
  highlightUserId,
}: FantasyLeaderboardMiniProps): React.JSX.Element {
  if (rows.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">{fantasyCopy.leaderboardEmpty}</p>
      </Card>
    );
  }

  const display = miniRows(rows, highlightUserId);

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-end justify-between px-1">
        <h2 className="font-display text-lg uppercase">{fantasyCopy.leaderboard}</h2>
        <SoftNavLink href={FANTASY_LEADERBOARD_PATH} className="text-xs font-bold text-muted">
          {fantasyCopy.fullLeaderboard}
        </SoftNavLink>
      </div>
      <Card className="flex flex-col gap-2 p-0">
        {display.map((row) => (
          <MiniRow key={row.teamId} row={row} highlight={row.userId === highlightUserId} />
        ))}
      </Card>
    </section>
  );
}

function miniRows(
  rows: readonly FantasyLeaderboardRow[],
  highlightUserId: string | undefined,
): FantasyLeaderboardRow[] {
  const top = rows.slice(0, TOP);
  const mine = highlightUserId ? rows.find((r) => r.userId === highlightUserId) : undefined;
  if (!mine || top.some((r) => r.teamId === mine.teamId)) return top;
  return [...top, mine];
}

function MiniRow(args: { row: FantasyLeaderboardRow; highlight: boolean }): React.JSX.Element {
  return (
    <SoftNavLink
      href={args.highlight ? FANTASY_PATH : fantasyTeamPath(args.row.teamId)}
      className={`flex items-center gap-3 px-3 py-2 ${args.highlight ? "bg-surface-alt" : ""}`}
    >
      <span className="w-6 font-display text-muted">{args.row.rank}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">{args.row.teamName}</p>
        <p className="truncate text-xs text-muted">{args.row.ownerName}</p>
      </div>
      <span className="font-display text-lg">{args.row.totalPoints}</span>
    </SoftNavLink>
  );
}
