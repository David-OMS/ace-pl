"use client";

import { PLAYER_POSITIONS, type PlayerPosition } from "@/config/player-positions";
import { SelectField } from "@/ui/select-field";

import { playersCopy } from "../copy";

const POSITION_OPTIONS = PLAYER_POSITIONS.map((position) => ({
  value: position,
  label: playersCopy.positions[position],
}));

type PositionSelectProps = {
  name?: string;
  defaultValue?: PlayerPosition;
  value?: PlayerPosition;
  onChange?: (value: PlayerPosition) => void;
  disabled?: boolean;
  required?: boolean;
};

/** Shared position dropdown — labels and options live here only. */
export function PositionSelect({
  name = "position",
  defaultValue = "MID",
  value,
  onChange,
  disabled,
  required = true,
}: PositionSelectProps): React.JSX.Element {
  return (
    <SelectField
      label={playersCopy.form.position}
      name={name}
      options={POSITION_OPTIONS}
      defaultValue={defaultValue}
      {...(value !== undefined ? { value } : {})}
      {...(onChange ? { onChange: (next) => onChange(next as PlayerPosition) } : {})}
      {...(disabled !== undefined ? { disabled } : {})}
      required={required}
    />
  );
}
