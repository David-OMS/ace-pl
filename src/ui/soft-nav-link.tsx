"use client";

import type { Route } from "next";
import Link from "next/link";

import { useSoftNavOptional } from "./soft-nav-context";

type SoftNavLinkProps = {
  href: Route;
  children: React.ReactNode;
  className?: string;
  scroll?: boolean;
  "aria-label"?: string;
};

/**
 * Same as Link, but under SoftNavProvider it drives SoftNavBusy instead of a frozen screen.
 * Outside the provider it falls back to a normal Link (loading.tsx still applies).
 */
export function SoftNavLink(props: SoftNavLinkProps): React.JSX.Element {
  const softNav = useSoftNavOptional();
  const extras = linkExtras(props);

  if (!softNav) {
    return (
      <Link href={props.href} {...extras}>
        {props.children}
      </Link>
    );
  }

  return (
    <Link
      href={props.href}
      {...extras}
      onClick={(event) => {
        if (shouldIgnoreClick(event)) return;
        event.preventDefault();
        softNav.navigate(props.href);
      }}
    >
      {props.children}
    </Link>
  );
}

function linkExtras(props: SoftNavLinkProps): {
  className?: string;
  scroll?: boolean;
  "aria-label"?: string;
} {
  return {
    ...(props.className !== undefined ? { className: props.className } : {}),
    ...(props.scroll !== undefined ? { scroll: props.scroll } : {}),
    ...(props["aria-label"] !== undefined ? { "aria-label": props["aria-label"] } : {}),
  };
}

function shouldIgnoreClick(event: React.MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}
