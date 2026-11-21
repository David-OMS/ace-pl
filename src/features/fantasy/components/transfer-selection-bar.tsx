"use client";

import { Button } from "@/ui/button";

import { fantasyCopy } from "../copy";
import { formatFantasyPrice } from "../domain/format-fantasy-price";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";
import { FantasyBottomSheet } from "./fantasy-bottom-sheet";

type TransferSelectionBarProps = {
  pick: FantasyPickView;
  swapTargetNames: readonly string[];
  onReplace: () => void;
  onRemove: () => void;
  onCaptain: () => void;
  onVice: () => void;
  onClear: () => void;
};

export function TransferSelectionBar(props: TransferSelectionBarProps): React.JSX.Element {
  return (
    <FantasyBottomSheet onClose={props.onClear} maxHeightClass="max-h-[45vh]" mode="dock">
      <SheetHeader pick={props.pick} onClear={props.onClear} />
      <div className="flex flex-col gap-3 overflow-y-auto px-4 py-4">
        <p className="text-sm text-muted">
          {fantasyCopy.swapHintWithTargets(props.pick.name, props.swapTargetNames)}
        </p>
        <SheetActions {...props} />
      </div>
    </FantasyBottomSheet>
  );
}

function SheetHeader(args: {
  pick: FantasyPickView;
  onClear: () => void;
}): React.JSX.Element {
  const role = args.pick.isCaptain
    ? ` · ${fantasyCopy.captain}`
    : args.pick.isVice
      ? ` · ${fantasyCopy.vice}`
      : "";
  return (
    <div className="flex items-start justify-between gap-3 border-b-2 border-line px-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-display text-xl uppercase">{args.pick.name}</p>
        <p className="text-xs font-bold text-muted">
          {args.pick.position} · {formatFantasyPrice(args.pick.price)}
          {role}
        </p>
      </div>
      <button type="button" className="shrink-0 text-sm font-bold" onClick={args.onClear}>
        {fantasyCopy.closePicker}
      </button>
    </div>
  );
}

function SheetActions(props: TransferSelectionBarProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <Button type="button" fullWidth onClick={props.onReplace}>
        {fantasyCopy.replacePlayer}
      </Button>
      {!props.pick.isBench ? (
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={props.pick.isCaptain ? "primary" : "secondary"}
            fullWidth
            onClick={props.onCaptain}
          >
            {fantasyCopy.setCaptain}
          </Button>
          <Button
            type="button"
            variant={props.pick.isVice ? "primary" : "secondary"}
            fullWidth
            onClick={props.onVice}
          >
            {fantasyCopy.setVice}
          </Button>
        </div>
      ) : null}
      <Button type="button" variant="danger" fullWidth onClick={props.onRemove}>
        {fantasyCopy.removeFromSquad}
      </Button>
    </div>
  );
}
