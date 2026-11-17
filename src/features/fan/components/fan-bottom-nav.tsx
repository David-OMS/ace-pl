"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/ui/icon";

import { FAN_NAV_ITEMS, isFanNavActive } from "../nav-items";

export function FanBottomNav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-line bg-surface pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      aria-label="Main"
    >
      <ul className="mx-auto flex max-w-xl justify-around px-1 pt-2">
        {FAN_NAV_ITEMS.map((item) => {
          const active = isFanNavActive(pathname, item);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex min-h-11 flex-col items-center justify-center gap-0.5 text-[11px] font-bold ${
                  active ? "text-ink" : "text-muted"
                }`}
              >
                <Icon icon={item.icon} size="md" />
                <span className={active ? "border-b-2 border-accent" : undefined}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
