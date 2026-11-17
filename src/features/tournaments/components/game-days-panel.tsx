import { formatGameDay } from "@/lib/dates/format-game-day";
import { Card } from "@/ui/card";

import { tournamentsCopy } from "../copy";
import type { GameDay } from "../queries/get-tournament";
import { AddGameDayForm } from "./add-game-day-form";
import { RemoveGameDayButton } from "./remove-game-day-button";

type GameDaysPanelProps = { tournamentId: string; gameDays: readonly GameDay[] };

export function GameDaysPanel({ tournamentId, gameDays }: GameDaysPanelProps): React.JSX.Element {
  const copy = tournamentsCopy.gameDays;

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="font-display text-lg uppercase">{copy.title}</h2>
      {gameDays.length === 0 ? (
        <p className="text-sm">{copy.empty}</p>
      ) : (
        <ol className="flex flex-col divide-y-2 divide-line-soft">
          {gameDays.map((day) => {
            const dateLabel = formatGameDay(day.playedOn);
            return (
              <li key={day.id} className="flex items-center justify-between gap-2 py-1">
                <span className="font-bold">{dateLabel}</span>
                <RemoveGameDayButton
                  tournamentId={tournamentId}
                  gameDayId={day.id}
                  dateLabel={dateLabel}
                />
              </li>
            );
          })}
        </ol>
      )}
      <AddGameDayForm tournamentId={tournamentId} />
    </Card>
  );
}
