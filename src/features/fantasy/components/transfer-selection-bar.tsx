"use client";

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

/** Slim dock under the pitch — actions in one tight strip. */
export function TransferSelectionBar(props: TransferSelectionBarProps): React.JSX.Element {
  return (
    <FantasyBottomSheet onClose={props.onClear} maxHeightClass="max-h-[40vh]" mode="dock">
      <div className="flex flex-col gap-2 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">
              {props.pick.name}
              <span className="font-normal text-muted">
                {" "}
                · {props.pick.position} · {formatFantasyPrice(props.pick.price)}
                {props.pick.isCaptain ? ` · ${fantasyCopy.captain}` : ""}
                {props.pick.isVice ? ` · ${fantasyCopy.vice}` : ""}
              </span>
            </p>
            <p className="truncate text-[11px] text-muted">
              {fantasyCopy.swapHintCompact(props.swapTargetNames)}
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 text-xs font-bold text-muted"
            onClick={props.onClear}
          >
            {fantasyCopy.closePicker}
          </button>
        </div>
        <SheetActions {...props} />
      </div>
    </FantasyBottomSheet>
  );
}

function SheetActions(props: TransferSelectionBarProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Chip onClick={props.onReplace}>{fantasyCopy.replacePlayer}</Chip>
      {!props.pick.isBench ? (
        <>
          <Chip active={props.pick.isCaptain} onClick={props.onCaptain}>
            {fantasyCopy.captain}
          </Chip>
          <Chip active={props.pick.isVice} onClick={props.onVice}>
            {fantasyCopy.vice}
          </Chip>
        </>
      ) : null}
      <Chip danger onClick={props.onRemove}>
        {fantasyCopy.removePlayer}
      </Chip>
    </div>
  );
}

function Chip(args: {
  children: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
}): React.JSX.Element {
  const tone = args.danger
    ? "border-hot bg-surface text-hot"
    : args.active
      ? "border-accent bg-accent text-on-accent"
      : "border-line bg-surface text-ink";
  return (
    <button
      type="button"
      onClick={args.onClick}
      className={`min-h-9 rounded-card border px-3 text-xs font-bold ${tone}`}
    >
      {args.children}
    </button>
  );
}
