import type { Route } from "next";

import type { ButtonVariant } from "./button";
import { SoftNavLink } from "./soft-nav-link";

const VARIANT_CLASSES = {
  primary: "bg-accent text-on-accent shadow-offset-sm",
  secondary: "bg-surface text-ink",
  danger: "bg-hot text-on-hot shadow-offset-sm",
} as const;

export type ButtonLinkProps = {
  href: Route;
  children: React.ReactNode;
  fullWidth?: boolean;
  variant?: ButtonVariant;
};

/** A link that looks like a button, for navigation actions such as "Add player". */
export function ButtonLink({
  href,
  children,
  fullWidth = false,
  variant = "primary",
}: ButtonLinkProps): React.JSX.Element {
  return (
    <SoftNavLink
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-card border-2 border-line px-4 text-sm font-bold ${VARIANT_CLASSES[variant]} ${fullWidth ? "w-full" : ""}`}
    >
      {children}
    </SoftNavLink>
  );
}
