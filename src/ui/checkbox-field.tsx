import { useId, type InputHTMLAttributes } from "react";

export type CheckboxFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  hint?: string;
};

export function CheckboxField({ label, hint, id, ...rest }: CheckboxFieldProps): React.JSX.Element {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="flex min-h-11 items-center gap-3 text-base font-bold">
        <input
          id={inputId}
          type="checkbox"
          aria-describedby={hintId}
          className="size-5 accent-accent"
          {...rest}
        />
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
