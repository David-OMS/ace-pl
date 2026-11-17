"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState, type InputHTMLAttributes } from "react";

import { Icon } from "@/ui/icon";

import { authCopy } from "../copy";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  hint?: string;
};

export function PasswordField({
  label,
  hint,
  id,
  className = "",
  ...rest
}: PasswordFieldProps): React.JSX.Element {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-xs font-bold tracking-wider text-muted uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          aria-describedby={hintId}
          className={`min-h-11 w-full rounded-card border-2 border-line bg-surface px-3 pr-11 text-base text-ink ${className}`}
          {...rest}
        />
        <button
          type="button"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-card p-1.5 text-muted"
          onClick={() => setVisible((open) => !open)}
          aria-label={visible ? authCopy.hidePassword : authCopy.showPassword}
        >
          <Icon icon={visible ? EyeOff : Eye} size="sm" />
        </button>
      </div>
      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
