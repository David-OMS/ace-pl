"use client";

import type { FantasyFormation } from "@/config/fantasy";

import { fantasyCopy } from "../copy";
import { CreateStepFormation } from "./create-step-formation";
import { FantasyBottomSheet } from "./fantasy-bottom-sheet";

type FormationPickerButtonProps = {
  formation: FantasyFormation;
  onChange: (formation: FantasyFormation) => void;
  allowed: ReadonlySet<FantasyFormation>;
  onBlocked: (formation: FantasyFormation) => void;
  error: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Compact trigger — full formation grid lives in a sheet. */
export function FormationPickerButton(props: FormationPickerButtonProps): React.JSX.Element {
  return (
    <>
      <button
        type="button"
        onClick={() => props.onOpenChange(true)}
        className="flex min-h-11 w-full items-center justify-between rounded-card border-2 border-line bg-surface px-3 text-left"
      >
        <span className="text-xs font-bold tracking-wide text-muted uppercase">
          {fantasyCopy.pickFormation}
        </span>
        <span className="font-display text-lg">{props.formation}</span>
      </button>
      {props.error && !props.open ? (
        <p role="alert" className="text-sm font-bold text-hot">
          {props.error}
        </p>
      ) : null}
      {props.open ? (
        <FormationSheet
          formation={props.formation}
          allowed={props.allowed}
          error={props.error}
          onBlocked={props.onBlocked}
          onPick={(next) => {
            props.onChange(next);
            props.onOpenChange(false);
          }}
          onClose={() => props.onOpenChange(false)}
        />
      ) : null}
    </>
  );
}

function FormationSheet(args: {
  formation: FantasyFormation;
  allowed: ReadonlySet<FantasyFormation>;
  error: string | null;
  onPick: (formation: FantasyFormation) => void;
  onBlocked: (formation: FantasyFormation) => void;
  onClose: () => void;
}): React.JSX.Element {
  return (
    <FantasyBottomSheet onClose={args.onClose} maxHeightClass="max-h-[70vh]">
      <div className="flex items-center justify-between border-b-2 border-line px-4 py-3">
        <p className="font-display text-lg uppercase">{fantasyCopy.pickFormation}</p>
        <button type="button" className="text-sm font-bold" onClick={args.onClose}>
          {fantasyCopy.closePicker}
        </button>
      </div>
      <div className="flex flex-col gap-3 px-4 py-4">
        <CreateStepFormation
          formation={args.formation}
          onChange={args.onPick}
          allowed={args.allowed}
          onBlocked={args.onBlocked}
        />
        {args.error ? (
          <p role="alert" className="text-sm font-bold text-hot">
            {args.error}
          </p>
        ) : null}
      </div>
    </FantasyBottomSheet>
  );
}
