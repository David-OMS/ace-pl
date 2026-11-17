import { ChevronLeft } from "lucide-react";
import type { Route } from "next";

import { Icon } from "./icon";
import { SoftNavLink } from "./soft-nav-link";

export type PageHeaderProps = {
  title: string;
  back?: { href: Route; label: string };
  action?: React.ReactNode;
};

export function PageHeader({ title, back, action }: PageHeaderProps): React.JSX.Element {
  return (
    <header className="flex flex-col gap-2">
      {back ? (
        <SoftNavLink
          href={back.href}
          className="inline-flex min-h-11 items-center gap-1 self-start text-sm font-bold text-muted"
        >
          <Icon icon={ChevronLeft} size="sm" />
          {back.label}
        </SoftNavLink>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl uppercase">{title}</h1>
        {action}
      </div>
    </header>
  );
}
