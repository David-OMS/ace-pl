"use client";

import { useMemo, useState } from "react";

import type { FantasyFormation } from "@/config/fantasy";

import { fantasyCopy } from "../copy";
import { assignSlotPick, type DraftSlotPick } from "../domain/assign-slot-pick";
import { buildPitchSlots, type PitchSlot } from "../domain/build-pitch-slots";
import { formatFantasyPrice } from "../domain/format-fantasy-price";
import type { PickablePlayer } from "../queries/list-pickable-players";
import { CreateStepFormation } from "./create-step-formation";
import { FantasyPitchSurface } from "./fantasy-pitch-surface";
import { PitchSlotLine } from "./pitch-slot-line";
import { PlayerPickerSheet } from "./player-picker-sheet";

type CreateStepSquadProps = {
  formation: FantasyFormation;
  onFormationChange: (formation: FantasyFormation) => void;
  squadSize: number;
  budget: number;
  pool: readonly PickablePlayer[];
  picks: readonly DraftSlotPick[];
  onChange: (picks: DraftSlotPick[]) => void;
};

export function CreateStepSquad(props: CreateStepSquadProps): React.JSX.Element {
  const [activeSlot, setActiveSlot] = useState<PitchSlot | null>(null);
  const slots = useMemo(
    () => buildPitchSlots(props.formation, props.squadSize),
    [props.formation, props.squadSize],
  );
  const picksBySlot = new Map(props.picks.map((p) => [p.slotKey, p]));
  const playersById = new Map(props.pool.map((p) => [p.id, p]));
  const spent = props.picks.reduce((sum, p) => sum + p.price, 0);
  const lineProps = { picksBySlot, playersById, onOpen: setActiveSlot };

  return (
    <div className="flex flex-col gap-4">
      <CreateStepFormation
        formation={props.formation}
        onChange={(next) => {
          props.onFormationChange(next);
          props.onChange([]);
          setActiveSlot(null);
        }}
      />
      <p className="text-sm font-bold">
        {fantasyCopy.spentLabel} {formatFantasyPrice(spent)} / {formatFantasyPrice(props.budget)} ·{" "}
        {props.picks.length}/{props.squadSize}
      </p>
      <FantasyPitchSurface>
        {(["FWD", "MID", "DEF", "GK"] as const).map((line) => (
          <PitchSlotLine key={line} slots={slots.filter((s) => s.line === line)} {...lineProps} />
        ))}
      </FantasyPitchSurface>
      <div className="rounded-card border-2 border-line bg-surface p-3">
        <p className="mb-2 text-[11px] font-bold tracking-wider text-muted uppercase">
          {fantasyCopy.bench}
        </p>
        <PitchSlotLine slots={slots.filter((s) => s.isBench)} {...lineProps} />
      </div>
      {activeSlot ? (
        <SquadPicker
          {...props}
          slot={activeSlot}
          picksBySlot={picksBySlot}
          onClose={() => setActiveSlot(null)}
        />
      ) : null}
    </div>
  );
}

function SquadPicker({
  formation,
  squadSize,
  budget,
  pool,
  picks,
  onChange,
  slot,
  picksBySlot,
  onClose,
}: CreateStepSquadProps & {
  slot: PitchSlot;
  picksBySlot: ReadonlyMap<string, DraftSlotPick>;
  onClose: () => void;
}): React.JSX.Element {
  const spentOthers = picks
    .filter((p) => p.slotKey !== slot.key)
    .reduce((sum, p) => sum + p.price, 0);
  const maxPrice = budget - spentOthers;

  return (
    <PlayerPickerSheet
      slot={slot}
      pool={pool}
      takenIds={new Set(picks.map((p) => p.playerId))}
      maxPrice={maxPrice}
      hasPlayer={picksBySlot.has(slot.key)}
      onClose={onClose}
      onClear={() => {
        onChange(assignSlotPick({ formation, squadSize, budget, picks, slot, player: null }));
        onClose();
      }}
      onPick={(player) => {
        onChange(assignSlotPick({ formation, squadSize, budget, picks, slot, player }));
        onClose();
      }}
    />
  );
}
