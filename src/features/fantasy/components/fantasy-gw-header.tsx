import { ButtonLink } from "@/ui/button-link";

import { fantasyCopy } from "../copy";
import { formatFantasyDeadline } from "../domain/format-fantasy-deadline";
import type { FantasyGameDayOption } from "../queries/list-fantasy-game-days";
import type { GameDayPointsSummary } from "../queries/list-game-day-point-summaries";
import type { TransferWindowMode } from "../queries/get-transfer-window";
import { FANTASY_TRANSFERS_PATH } from "../routes";
import { FantasyGwNav, type FantasyGwNavOption } from "./fantasy-gw-nav";
import { FantasyGwScoreStrip } from "./fantasy-gw-score-strip";

type FantasyGwHeaderProps = {
  days: readonly FantasyGameDayOption[];
  options: readonly FantasyGwNavOption[];
  selectedId: string | null;
  onSelect: (dayId: string | null) => void;
  gwPoints: number | null;
  summaries: readonly GameDayPointsSummary[] | undefined;
  showEditActions: boolean;
  showDeadline: boolean;
  transferWindow: TransferWindowMode;
  freeTransfers: number;
};

export function FantasyGwHeader(props: FantasyGwHeaderProps): React.JSX.Element {
  const summary = summaryFor(props.summaries, props.selectedId);
  const deadlineDay = props.showDeadline ? deadlinePlayedOn(props.days, props.selectedId) : null;

  return (
    <>
      <FantasyGwNav
        options={props.options}
        selectedId={props.selectedId}
        onSelect={props.onSelect}
      />
      <FantasyGwScoreStrip
        average={summary?.average ?? null}
        points={props.gwPoints}
        highest={summary?.highest ?? null}
      />
      {deadlineDay ? (
        <p className="text-center text-xs font-bold text-muted">
          {formatFantasyDeadline(deadlineDay)}
        </p>
      ) : null}
      {props.showEditActions ? (
        <EditActions
          transferWindow={props.transferWindow}
          freeTransfers={props.freeTransfers}
        />
      ) : null}
    </>
  );
}

function EditActions(args: {
  transferWindow: TransferWindowMode;
  freeTransfers: number;
}): React.JSX.Element {
  if (args.transferWindow === "locked") {
    return (
      <p className="border-2 border-line bg-surface px-3 py-3 text-sm">
        <span className="font-bold">{fantasyCopy.transfersLockedTitle}. </span>
        {fantasyCopy.transfersLockedBody}
      </p>
    );
  }
  const label =
    args.transferWindow === "unlimited"
      ? fantasyCopy.editSquadUnlimited
      : fantasyCopy.editSquadWithFree(args.freeTransfers);
  return (
    <ButtonLink href={FANTASY_TRANSFERS_PATH} fullWidth>
      {label}
    </ButtonLink>
  );
}

function summaryFor(
  summaries: readonly GameDayPointsSummary[] | undefined,
  gameDayId: string | null,
): GameDayPointsSummary | null {
  if (!summaries || !gameDayId) return null;
  return summaries.find((row) => row.gameDayId === gameDayId) ?? null;
}

function deadlinePlayedOn(
  days: readonly FantasyGameDayOption[],
  selectedId: string | null,
): string | null {
  if (selectedId) {
    return days.find((day) => day.id === selectedId)?.playedOn ?? null;
  }
  const upcoming = days.find((day) => !day.hasScores) ?? days[days.length - 1];
  return upcoming?.playedOn ?? null;
}
