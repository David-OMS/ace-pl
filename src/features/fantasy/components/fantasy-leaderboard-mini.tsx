import { Card } from "@/ui/card";
import { SoftNavLink } from "@/ui/soft-nav-link";

import { fantasyCopy } from "../copy";
import type { FantasyLeaderboardRow } from "../queries/list-fantasy-leaderboard";
import { fantasyTeamPath, FANTASY_LEADERBOARD_PATH } from "../routes";

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

  const top = rows.slice(0, TOP);
  const mine = highlightUserId ? rows.find((r) => r.userId === highlightUserId) : undefined;
  const showMine = mine && !top.some((r) => r.teamId === mine.teamId) ? [mine] : [];
  const display = [...top, ...showMine];

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
          <SoftNavLink
            key={row.teamId}
            href={fantasyTeamPath(row.teamId)}
            className={`flex items-center gap-3 px-3 py-2 ${
              row.userId === highlightUserId ? "bg-surface-alt" : ""
            }`}
          >
            <span className="w-6 font-display text-muted">{row.rank}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{row.teamName}</p>
              <p className="truncate text-xs text-muted">{row.ownerName}</p>
            </div>
            <span className="font-display text-lg">{row.totalPoints}</span>
          </SoftNavLink>
        ))}
      </Card>
    </section>
  );
}
