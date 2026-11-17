import { Button } from "@/ui/button";

import { fantasyCopy } from "../copy";
import type { DraftPick } from "../domain/draft-pick";

type WizardNavProps = {
  step: number;
  lastStep: number;
  canNext: boolean;
  isPending: boolean;
  onBack: () => void;
  onNext: () => void;
  formAction: (payload: FormData) => void;
  tournamentId: string;
  name: string;
  formation: string;
  picks: readonly DraftPick[];
};

export function WizardNav({
  step,
  lastStep,
  canNext,
  isPending,
  onBack,
  onNext,
  formAction,
  tournamentId,
  name,
  formation,
  picks,
}: WizardNavProps): React.JSX.Element {
  const last = step >= lastStep;
  const payload = picks.map(({ playerId, isBench, isCaptain, isVice }) => ({
    playerId,
    isBench,
    isCaptain,
    isVice,
  }));

  return (
    <div className="flex gap-2">
      {step > 0 ? (
        <Button type="button" variant="secondary" onClick={onBack}>
          {fantasyCopy.back}
        </Button>
      ) : null}
      {!last ? (
        <Button type="button" fullWidth disabled={!canNext} onClick={onNext}>
          {fantasyCopy.next}
        </Button>
      ) : (
        <form action={formAction} className="flex-1">
          <input type="hidden" name="tournamentId" value={tournamentId} />
          <input type="hidden" name="name" value={name.trim()} />
          <input type="hidden" name="formation" value={formation} />
          <input type="hidden" name="picks" value={JSON.stringify(payload)} />
          <Button type="submit" fullWidth disabled={!canNext || isPending}>
            {isPending ? fantasyCopy.saving : fantasyCopy.submit}
          </Button>
        </form>
      )}
    </div>
  );
}
