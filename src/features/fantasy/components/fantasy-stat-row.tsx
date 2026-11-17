import { fantasyCopy } from "../copy";
import { formatFantasyPrice } from "../domain/format-fantasy-price";

type FantasyStatRowProps = {
  totalPoints: number;
  bank: number;
  freeTransfers: number;
  beforeFirstDeadline: boolean;
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
      {props.beforeFirstDeadline ? (
        <StatBox label={fantasyCopy.squadEditsLabel} value={fantasyCopy.squadEditsOpen} />
      ) : (
        <StatBox label={fantasyCopy.freeTransfers} value={String(props.freeTransfers)} />
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-card border-2 border-line bg-surface px-2 py-3 text-center">
      <p className="font-display text-2xl">{value}</p>
      <p className="text-[10px] font-bold tracking-wide text-muted uppercase">{label}</p>
    </div>
  );
}
