import type { FantasyFormation } from "@/config/fantasy";

import type { DraftSlotPick } from "../domain/assign-slot-pick";
import type { PickablePlayer } from "../queries/list-pickable-players";
import { CreateStepCaptain } from "./create-step-captain";
import { CreateStepName } from "./create-step-name";
import { CreateStepSquad } from "./create-step-squad";

type WizardStepBodyProps = {
  step: number;
  name: string;
  setName: (name: string) => void;
  formation: FantasyFormation;
  setFormation: (formation: FantasyFormation) => void;
  squadSize: number;
  budget: number;
  pool: readonly PickablePlayer[];
  picks: readonly DraftSlotPick[];
  setPicks: (picks: DraftSlotPick[]) => void;
};

export function WizardStepBody({
  step,
  name,
  setName,
  formation,
  setFormation,
  squadSize,
  budget,
  pool,
  picks,
  setPicks,
}: WizardStepBodyProps): React.JSX.Element | null {
  if (step === 0) return <CreateStepName name={name} onChange={setName} />;
  if (step === 1) {
    return (
      <CreateStepSquad
        formation={formation}
        onFormationChange={setFormation}
        squadSize={squadSize}
        budget={budget}
        pool={pool}
        picks={picks}
        onChange={setPicks}
      />
    );
  }
  if (step === 2) {
    return <CreateStepCaptain pool={pool} picks={picks} onChange={setPicks} />;
  }
  return null;
}
