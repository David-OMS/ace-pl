import { useId, type InputHTMLAttributes } from "react";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export function TextField({
  label,
  hint,
  id,
  className = "",
  ...rest
}: TextFieldProps): React.JSX.Element {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-xs font-bold tracking-wider text-muted uppercase">
        {label}
      </label>
      <input
        id={inputId}
        aria-describedby={hintId}
        className={`min-h-11 rounded-card border-2 border-line bg-surface px-3 text-base text-ink ${className}`}
        {...rest}
      />
      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
