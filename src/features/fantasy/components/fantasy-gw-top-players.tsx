import Link from "next/link";

import { Card } from "@/ui/card";

import { fantasyCopy } from "../copy";
import type { GameDayTopPlayer } from "../queries/list-game-day-top-players";
import { fantasyGwPlayersPath } from "../routes";

const TOP = 5;

type FantasyGwTopPlayersProps = {
  gameDayId: string;
  rows: readonly GameDayTopPlayer[];
};

export function FantasyGwTopPlayers({
  gameDayId,
  rows,
}: FantasyGwTopPlayersProps): React.JSX.Element | null {
  if (rows.length === 0) return null;
  const top = rows.slice(0, TOP);

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-end justify-between px-1">
        <h2 className="font-display text-lg uppercase">{fantasyCopy.gwTopPlayers}</h2>
        <Link href={fantasyGwPlayersPath(gameDayId)} className="text-xs font-bold text-muted">
          {fantasyCopy.fullGwPlayers}
        </Link>
      </div>
      <Card className="flex flex-col p-0">
        {top.map((row, index) => (
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
    </section>
  );
}
