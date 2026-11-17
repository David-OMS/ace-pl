"use client";

import { usePathname } from "next/navigation";

import { Icon } from "@/ui/icon";
import { SoftNavLink } from "@/ui/soft-nav-link";

import { ADMIN_NAV_ITEMS, isAdminNavActive } from "../nav-items";

export function AdminBottomNav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-line bg-surface pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      aria-label="Admin"
    >
      <ul className="mx-auto flex max-w-xl justify-around px-1 pt-2">
        {ADMIN_NAV_ITEMS.map((item) => {
          const active = isAdminNavActive(pathname, item);
          return (
            <li key={item.href} className="flex-1">
              <SoftNavLink
                href={item.href}
                className={`flex min-h-11 flex-col items-center justify-center gap-0.5 text-[11px] font-bold ${
                  active ? "text-ink" : "text-muted"
                }`}
              >
                <Icon icon={item.icon} size="md" />
                <span className={active ? "border-b-2 border-accent" : undefined}>
                  {item.label}
                </span>
              </SoftNavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
