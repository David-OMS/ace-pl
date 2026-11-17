"use client";

import { useActionState, useState } from "react";

import { FANTASY_FORMATIONS, type FantasyFormation } from "@/config/fantasy";
import { FormFeedback } from "@/ui/form-feedback";

import { createFantasyTeam, type CreateFantasyTeamState } from "../actions/create-fantasy-team";
import { fantasyCopy } from "../copy";
import type { DraftSlotPick } from "../domain/assign-slot-pick";
import { canAdvanceWizard } from "../domain/can-advance-wizard";
import type { PickablePlayer } from "../queries/list-pickable-players";
import { FantasyTheme } from "./fantasy-theme";
import { WizardNav } from "./wizard-nav";
import { WizardStepBody } from "./wizard-step-body";

type FantasyCreateWizardProps = {
  tournamentId: string;
  squadSize: number;
  budget: number;
  pool: readonly PickablePlayer[];
};

const STEPS = ["name", "squad", "captain"] as const;

export function FantasyCreateWizard({
  tournamentId,
  squadSize,
  budget,
  pool,
}: FantasyCreateWizardProps): React.JSX.Element {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [formation, setFormation] = useState<FantasyFormation>(FANTASY_FORMATIONS[0]);
  const [picks, setPicks] = useState<DraftSlotPick[]>([]);
  const [state, formAction, isPending] = useActionState<CreateFantasyTeamState, FormData>(
    createFantasyTeam,
    null,
  );

  const canNext = canAdvanceWizard({ step, name, formation, picks, squadSize, budget });

  return (
    <FantasyTheme className="flex flex-col gap-4 px-4 py-4 pb-8">
      <h1 className="font-display text-2xl uppercase">{fantasyCopy.createTitle}</h1>
      <p className="text-xs font-bold tracking-wide text-muted uppercase">
        {fantasyCopy.steps[STEPS[step] ?? "name"]} · {step + 1}/{STEPS.length}
      </p>
      <WizardStepBody
        step={step}
        name={name}
        setName={setName}
        formation={formation}
        setFormation={setFormation}
        squadSize={squadSize}
        budget={budget}
        pool={pool}
        picks={picks}
        setPicks={setPicks}
      />
      <FormFeedback error={state && !state.ok ? fantasyCopy.errors[state.error] : null} />
      <WizardNav
        step={step}
        lastStep={STEPS.length - 1}
        canNext={canNext}
        isPending={isPending}
        onBack={() => setStep(step - 1)}
        onNext={() => setStep(step + 1)}
        formAction={formAction}
        tournamentId={tournamentId}
        name={name}
        formation={formation}
        picks={picks}
      />
    </FantasyTheme>
  );
}
