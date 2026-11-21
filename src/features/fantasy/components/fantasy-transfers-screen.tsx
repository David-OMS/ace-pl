"use client";

import { useActionState, useMemo, useState } from "react";

import { ChevronLeft } from "lucide-react";

import { Icon } from "@/ui/icon";
import { SoftNavLink } from "@/ui/soft-nav-link";

import {
  applyFantasyTransfers,
  type ApplyFantasyTransfersState,
} from "../actions/apply-fantasy-transfers";
import { fantasyCopy } from "../copy";
import { formatFantasyPrice } from "../domain/format-fantasy-price";
import type { MyFantasyTeam } from "../queries/get-my-fantasy-team";
import type { PickablePlayer } from "../queries/list-pickable-players";
import { FANTASY_PATH } from "../routes";
import { ClubLimitBanner } from "./club-limit-banner";
import { FormationPickerButton } from "./formation-picker-button";
import { FantasyPitchView } from "./fantasy-pitch-view";
import { FantasyTheme } from "./fantasy-theme";
import { squadDraftStatus } from "./squad-draft-status";
import { TransferInPicker } from "./transfer-in-picker";
import { TransferPreviewPanel } from "./transfer-preview-panel";
import { TransferSelectionBar } from "./transfer-selection-bar";
import { TransfersAllowance } from "./transfers-allowance";
import { useSwapFlash } from "./use-swap-flash";
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
  const [formationOpen, setFormationOpen] = useState(false);
  const swapFlash = useSwapFlash(draft.lastSwapFlash, draft.clearSwapFlash);

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
  const actionSheetOpen = Boolean(draft.activeOut && !draft.replacing);
  const pickerOpen = Boolean(draft.activeEmpty || (draft.activeOut && draft.replacing));

  return (
    <FantasyTheme
      className={`flex flex-col gap-3 px-4 py-3 ${actionSheetOpen ? "pb-36" : "pb-8"}`}
    >
      <header className="flex items-center gap-2">
        <SoftNavLink
          href={FANTASY_PATH}
          className="inline-flex min-h-10 items-center gap-1 text-sm font-bold text-muted"
        >
          <Icon icon={ChevronLeft} size="sm" />
          {fantasyCopy.backToFantasy}
        </SoftNavLink>
        <h1 className="truncate font-display text-lg uppercase">{fantasyCopy.transfersTitle}</h1>
      </header>
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
      <FormationPickerButton
        formation={draft.formation}
        onChange={draft.setFormation}
        allowed={draft.allowedFormations}
        onBlocked={draft.reportBlockedFormation}
        error={draft.formationError}
        open={formationOpen}
        onOpenChange={(open) => {
          if (open) {
            draft.clearOut();
            setFormationOpen(true);
            return;
          }
          setFormationOpen(false);
        }}
      />
      {swapFlash ? (
        <p className="rounded-card border-2 border-accent bg-surface px-3 py-2 text-sm font-bold">
          {swapFlash}
        </p>
      ) : null}
      <ClubLimitBanner picks={draft.picks} />
      <FantasyPitchView
        formation={draft.formation}
        picks={draft.picks}
        onSelect={(pick) => {
          setFormationOpen(false);
          draft.openOut(pick);
        }}
        onSelectEmpty={(slot) => {
          setFormationOpen(false);
          draft.openEmpty(slot);
        }}
        selectedId={draft.activeOut?.playerId ?? null}
        swapTargetIds={draft.swapTargetIds}
      />
      {actionSheetOpen && draft.activeOut ? (
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
