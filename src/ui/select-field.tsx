"use client";

import { useId, useState } from "react";

import { SelectControl, type SelectOption } from "./select-control";

export type { SelectOption };

export type SelectFieldProps = {
  label: string;
  options: readonly SelectOption[];
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  /** Visually hide the label; it stays available to assistive tech. */
  hideLabel?: boolean;
  id?: string;
};

export function SelectField({
  label,
  options,
  name,
  defaultValue = "",
  value,
  onChange,
  disabled,
  required,
  placeholder,
  hideLabel = false,
  id,
}: SelectFieldProps): React.JSX.Element {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const labelId = `${controlId}-label`;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const selectedValue = value ?? uncontrolled;

  function handleChange(next: string): void {
    if (value === undefined) setUncontrolled(next);
    onChange?.(next);
  }

  return (
    <div className="flex flex-col gap-1">
      <span
        id={labelId}
        className={hideLabel ? "sr-only" : "text-xs font-bold tracking-wider text-muted uppercase"}
      >
        {label}
      </span>
      <SelectControl
        id={controlId}
        labelledBy={labelId}
        {...(name !== undefined ? { name } : {})}
        options={options}
        value={selectedValue}
        onChange={handleChange}
        {...(disabled !== undefined ? { disabled } : {})}
        {...(required !== undefined ? { required } : {})}
        {...(placeholder !== undefined ? { placeholder } : {})}
      />
    </div>
  );
}
