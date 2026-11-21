import { ThemeModeToggle } from "@/theme/components/theme-mode-toggle";
import type { ThemeMode } from "@/theme/theme-config";

import { adminCopy } from "../copy";

type AdminBrandBarProps = { initialMode: ThemeMode };

/** Mockup top bar: ACE PL + hot ADMIN tag. */
export function AdminBrandBar({ initialMode }: AdminBrandBarProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-2.5 px-4 pt-2 pb-3">
      <div className="flex items-center gap-2.5">
        <p className="font-display text-2xl tracking-wide uppercase">
          {adminCopy.brandPrimary}{" "}
          <span className="bg-accent px-1 text-on-accent">{adminCopy.brandAccent}</span>
        </p>
        <span className="bg-hot px-1.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-on-hot uppercase">
          {adminCopy.tag}
        </span>
      </div>
      <ThemeModeToggle initialMode={initialMode} />
    </div>
  );
}
