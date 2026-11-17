import type { ButtonHTMLAttributes } from "react";

const VARIANT_CLASSES = {
  primary: "bg-accent text-on-accent shadow-offset-sm",
  secondary: "bg-surface text-ink",
  danger: "bg-hot text-on-hot shadow-offset-sm",
} as const;

export type ButtonVariant = keyof typeof VARIANT_CLASSES;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  type = "button",
  ...rest
}: ButtonProps): React.JSX.Element {
  const widthClass = fullWidth ? "w-full" : "";
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-card border-2 border-line px-4 text-sm font-bold transition-transform active:translate-x-px active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${widthClass} ${className}`}
      {...rest}
    />
  );
}
