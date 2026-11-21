"use client";

import { useActionState, useEffect, useMemo, useRef } from "react";

import { PageHeader } from "@/ui/page-header";

import {
  applyFantasyTransfers,
  type ApplyFantasyTransfersState,
} from "../actions/apply-fantasy-transfers";
import { fantasyCopy } from "../copy";
import type { MyFantasyTeam } from "../queries/get-my-fantasy-team";
import type { PickablePlayer } from "../queries/list-pickable-players";
import { FANTASY_PATH } from "../routes";
import { ClubLimitBanner } from "./club-limit-banner";
import { CreateStepFormation } from "./create-step-formation";
import { FantasyPitchView } from "./fantasy-pitch-view";
import { FantasyTheme } from "./fantasy-theme";
import { squadDraftStatus } from "./squad-draft-status";
import { TransferInPicker } from "./transfer-in-picker";
import { TransferPreviewPanel } from "./transfer-preview-panel";
import { TransferSelectionBar } from "./transfer-selection-bar";
import { TransfersAllowance } from "./transfers-allowance";
import { useTransferDraft } from "./use-transfer-draft";

type FantasyTransfersScreenProps = {
  team: MyFantasyTeam;
  pool: readonly PickablePlayer[];
  budget: number;
  beforeFirstDeadline: boolean;
};

// eslint-disable-next-line max-lines-per-function, complexity -- transfers edit screen
export function FantasyTransfersScreen({
  team,
  pool,
  budget,
  beforeFirstDeadline,
}: FantasyTransfersScreenProps): React.JSX.Element {
  const draft = useTransferDraft({
    team,
    pool,
    budget,
    isUnlimited: beforeFirstDeadline,
  });
  const [state, formAction, isPending] = useActionState<ApplyFantasyTransfersState, FormData>(
    applyFantasyTransfers,
    null,
  );
  const clearFlashRef = useRef(draft.clearSwapFlash);
  useEffect(() => {
    clearFlashRef.current = draft.clearSwapFlash;
  });

  const originalIds = useMemo(
    () =>
      team.picks
        .map((p) => p.playerId)
        .sort()
        .join(","),
    [team.picks],
  );
  const draftIds = useMemo(
    () =>
      draft.picks
        .map((p) => p.playerId)
        .sort()
        .join(","),
    [draft.picks],
  );
  const status = useMemo(
    () =>
      squadDraftStatus({
        formation: draft.formation,
        budget,
        picks: draft.picks,
      }),
    [draft.formation, draft.picks, budget],
  );

  const hasChanges =
    draft.formation !== team.formation ||
    draft.swaps.length > 0 ||
    draft.lineupDirty ||
    (beforeFirstDeadline && draftIds !== originalIds);

  const canSave = hasChanges && status.valid;
  const pickerOpen = Boolean(draft.activeEmpty || (draft.activeOut && draft.replacing));
  const swapFlash = useMemo(() => {
    if (!draft.lastSwapFlash) return null;
    const [a, b] = draft.lastSwapFlash.split("|");
    if (!a || !b) return null;
    return fantasyCopy.swappedFlash(a, b);
  }, [draft.lastSwapFlash]);

  useEffect(() => {
    if (!draft.lastSwapFlash) return;
    const timer = window.setTimeout(() => clearFlashRef.current(), 2500);
    return () => window.clearTimeout(timer);
  }, [draft.lastSwapFlash]);

  return (
    <FantasyTheme className="flex flex-col gap-4 px-4 py-4 pb-8">
      <PageHeader
        title={fantasyCopy.transfersTitle}
        back={{ href: FANTASY_PATH, label: fantasyCopy.backToFantasy }}
      />
      <TransfersAllowance
        bank={draft.bank}
        unlimited={beforeFirstDeadline}
        freeLeft={
          beforeFirstDeadline
            ? team.freeTransfers
            : draft.preview.ok
              ? draft.preview.value.freeTransfers
              : team.freeTransfers
        }
      />
      <CreateStepFormation
        formation={draft.formation}
        onChange={draft.setFormation}
        allowed={draft.allowedFormations}
        onBlocked={draft.reportBlockedFormation}
      />
      {draft.formationError ? (
        <p role="alert" className="text-sm font-bold text-hot">
          {draft.formationError}
        </p>
      ) : null}
      {swapFlash ? (
        <p className="rounded-card border-2 border-accent bg-surface px-3 py-2 text-sm font-bold">
          {swapFlash}
        </p>
      ) : null}
      <ClubLimitBanner picks={draft.picks} />
      <FantasyPitchView
        formation={draft.formation}
        picks={draft.picks}
        onSelect={draft.openOut}
        onSelectEmpty={draft.openEmpty}
        selectedId={draft.activeOut?.playerId ?? null}
        swapTargetIds={draft.swapTargetIds}
      />
      {draft.activeOut && !draft.replacing ? (
        <TransferSelectionBar
          pick={draft.activeOut}
          swapTargetNames={draft.swapTargetNames}
          onReplace={draft.openReplace}
          onRemove={draft.removeOut}
          onCaptain={draft.setCaptain}
          onVice={draft.setVice}
          onClear={draft.clearOut}
        />
      ) : null}
      {pickerOpen ? (
        <TransferInPicker
          title={draft.activeEmpty ? fantasyCopy.addPlayer : fantasyCopy.replacePlayer}
          hint={
            draft.activeOut
              ? fantasyCopy.replaceHint(
                  draft.activeOut.name,
                  formatFantasyPrice(draft.bank + draft.activeOut.price),
                )
              : fantasyCopy.addHint(formatFantasyPrice(draft.bank))
          }
          options={draft.inOptions}
          onPick={draft.pickIn}
          onClose={draft.clearOut}
          onRemove={undefined}
        />
      ) : null}
      <TransferPreviewPanel
        teamId={team.id}
        formation={draft.formation}
        swaps={draft.swaps}
        picks={draft.picks}
        bank={draft.bank}
        freeTransfers={team.freeTransfers}
        beforeFirstDeadline={beforeFirstDeadline}
        nameById={draft.nameById}
        preview={draft.preview}
        error={state && !state.ok ? fantasyCopy.errors[state.error] : null}
        isPending={isPending}
        formAction={formAction}
        canSave={canSave}
        squadValid={status.valid}
        hasChanges={hasChanges}
        invalidReason={status.reason}
      />
    </FantasyTheme>
  );
}
