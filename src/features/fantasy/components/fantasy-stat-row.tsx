import { fantasyCopy } from "../copy";
import { formatFantasyPrice } from "../domain/format-fantasy-price";
import type { TransferWindowMode } from "../queries/get-transfer-window";

type FantasyStatRowProps = {
  totalPoints: number;
  bank: number;
  freeTransfers: number;
  transferWindow: TransferWindowMode;
  gwPoints: number | null;
};

export function FantasyStatRow(props: FantasyStatRowProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-2">
      <StatBox label={fantasyCopy.totalPoints} value={String(props.totalPoints)} />
      <StatBox
        label={props.gwPoints !== null ? fantasyCopy.gameweekPoints : fantasyCopy.bankLabel}
        value={props.gwPoints !== null ? String(props.gwPoints) : formatFantasyPrice(props.bank)}
      />
      <ThirdStat window={props.transferWindow} freeTransfers={props.freeTransfers} />
    </div>
  );
}

function ThirdStat(args: { window: TransferWindowMode; freeTransfers: number }): React.JSX.Element {
  if (args.window === "unlimited") {
    return <StatBox label={fantasyCopy.squadEditsLabel} value={fantasyCopy.squadEditsOpen} />;
  }
  if (args.window === "locked") {
    return <StatBox label={fantasyCopy.squadEditsLabel} value={fantasyCopy.squadEditsLocked} />;
  }
  return <StatBox label={fantasyCopy.freeTransfers} value={String(args.freeTransfers)} />;
}

function StatBox({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-card border-2 border-line bg-surface px-2 py-3 text-center">
      <p className="font-display text-2xl">{value}</p>
      <p className="text-[10px] font-bold tracking-wide text-muted uppercase">{label}</p>
    </div>
  );
}
