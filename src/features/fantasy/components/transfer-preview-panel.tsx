import { Button } from "@/ui/button";
import { ButtonLink } from "@/ui/button-link";
import { FormFeedback } from "@/ui/form-feedback";

import { fantasyCopy } from "../copy";
import type { applyTransferBatch } from "../domain/apply-transfer";
import { formatFantasyPrice } from "../domain/format-fantasy-price";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";
import { FANTASY_PATH } from "../routes";
import type { SwapDraft } from "./use-transfer-draft";

type TransferPreviewPanelProps = {
  teamId: string;
  formation: string;
  swaps: readonly SwapDraft[];
  picks: readonly FantasyPickView[];
  bank: number;
  beforeFirstDeadline: boolean;
  nameById: Map<string, string>;
  preview: ReturnType<typeof applyTransferBatch>;
  error: string | null;
  isPending: boolean;
  formAction: (payload: FormData) => void;
  canSave: boolean;
  squadValid: boolean;
  hasChanges: boolean;
  invalidReason: string | null;
};

// eslint-disable-next-line max-lines-per-function, complexity -- save preview states
export function TransferPreviewPanel({
  teamId,
  formation,
  swaps,
  picks,
  bank,
  beforeFirstDeadline,
  nameById,
  preview,
  error,
  isPending,
  formAction,
  canSave,
  squadValid,
  hasChanges,
  invalidReason,
}: TransferPreviewPanelProps): React.JSX.Element {
  const fundsOk = beforeFirstDeadline || swaps.length === 0 || preview.ok;
  const squadPayload = picks.map((p) => ({
    playerId: p.playerId,
    isBench: p.isBench,
    isCaptain: p.isCaptain,
    isVice: p.isVice,
  }));

  const statusLine = beforeFirstDeadline
    ? `${fantasyCopy.bankLabel} ${formatFantasyPrice(bank)}`
    : preview.ok
      ? `${fantasyCopy.bankLabel} ${formatFantasyPrice(preview.value.bank)} · ${fantasyCopy.transferHit(preview.value.pointCost)}`
      : swaps.length === 0
        ? `${fantasyCopy.bankLabel} ${formatFantasyPrice(bank)} · ${fantasyCopy.formationOnly}`
        : fantasyCopy.errors.insufficient_funds;

  return (
    <>
      {swaps.length > 0 ? (
        <ul className="flex flex-col gap-1 text-sm">
          {swaps.map((swap) => (
            <li key={`${swap.playerOutId}-${swap.playerInId}`}>
              {nameById.get(swap.playerOutId) ?? "?"} → {nameById.get(swap.playerInId) ?? "?"}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="text-sm font-bold">{statusLine}</p>
      {invalidReason ? <p className="text-sm text-hazard">{invalidReason}</p> : null}
      {squadValid && !hasChanges ? (
        <p className="text-sm text-muted">{fantasyCopy.noChanges}</p>
      ) : null}
      <FormFeedback error={error} />
      {squadValid && !hasChanges ? (
        <ButtonLink href={FANTASY_PATH} fullWidth>
          {fantasyCopy.doneEditing}
        </ButtonLink>
      ) : (
        <form action={formAction}>
          <input type="hidden" name="teamId" value={teamId} />
          <input type="hidden" name="formation" value={formation} />
          <input type="hidden" name="swaps" value={JSON.stringify(swaps)} />
          <input type="hidden" name="squad" value={JSON.stringify(squadPayload)} />
          <Button type="submit" fullWidth disabled={!canSave || !fundsOk || isPending}>
            {isPending ? fantasyCopy.saving : fantasyCopy.confirmTransfers}
          </Button>
        </form>
      )}
    </>
  );
}
