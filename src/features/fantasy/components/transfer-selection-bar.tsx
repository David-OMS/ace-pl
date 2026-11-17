import { Button } from "@/ui/button";

import { fantasyCopy } from "../copy";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";

type TransferSelectionBarProps = {
  pick: FantasyPickView;
  swapTargetNames: readonly string[];
  beforeFirstDeadline: boolean;
  onReplace: () => void;
  onRemove: () => void;
  onCaptain: () => void;
  onVice: () => void;
  onClear: () => void;
};

// eslint-disable-next-line max-lines-per-function -- selection actions bar
export function TransferSelectionBar({
  pick,
  swapTargetNames,
  beforeFirstDeadline,
  onReplace,
  onRemove,
  onCaptain,
  onVice,
  onClear,
}: TransferSelectionBarProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2 rounded-card border-2 border-line bg-surface p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate font-bold">{pick.name}</p>
        <button type="button" className="text-xs font-bold text-muted" onClick={onClear}>
          {fantasyCopy.closePicker}
        </button>
      </div>
      <p className="text-sm font-bold text-hot">
        {fantasyCopy.swapHintWithTargets(pick.name, swapTargetNames)}
      </p>
      <div className="flex flex-wrap gap-2">
        {!pick.isBench ? (
          <>
            <Button
              type="button"
              variant={pick.isCaptain ? "primary" : "secondary"}
              onClick={onCaptain}
            >
              {fantasyCopy.setCaptain}
            </Button>
            <Button type="button" variant={pick.isVice ? "primary" : "secondary"} onClick={onVice}>
              {fantasyCopy.setVice}
            </Button>
          </>
        ) : null}
        <Button type="button" variant="secondary" onClick={onReplace}>
          {fantasyCopy.replacePlayer}
        </Button>
        {beforeFirstDeadline ? (
          <button
            type="button"
            onClick={onRemove}
            className="min-h-11 px-2 text-sm font-bold text-hot underline"
          >
            {fantasyCopy.removeFromSquad}
          </button>
        ) : null}
      </div>
    </div>
  );
}
