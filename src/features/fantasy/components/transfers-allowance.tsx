import { fantasyCopy } from "../copy";
import { formatFantasyPrice } from "../domain/format-fantasy-price";

type TransfersAllowanceProps = {
  bank: number;
  unlimited: boolean;
  freeLeft: number;
};

export function TransfersAllowance(props: TransfersAllowanceProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-card border-2 border-line bg-surface px-2 py-2 text-center">
        <p className="font-display text-xl">{formatFantasyPrice(props.bank)}</p>
        <p className="text-[10px] font-bold tracking-wide text-muted uppercase">
          {fantasyCopy.bankLabel}
        </p>
      </div>
      <div className="rounded-card border-2 border-line bg-surface px-2 py-2 text-center">
        <p className="font-display text-xl">{props.unlimited ? "∞" : String(props.freeLeft)}</p>
        <p className="text-[10px] font-bold tracking-wide text-muted uppercase">
          {fantasyCopy.freeTransfers}
        </p>
      </div>
    </div>
  );
}
