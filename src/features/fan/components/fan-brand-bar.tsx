import { User } from "lucide-react";

import { ThemeModeToggle } from "@/theme/components/theme-mode-toggle";
import { Icon } from "@/ui/icon";
import { SoftNavLink } from "@/ui/soft-nav-link";

import { fanCopy } from "../copy";
import { FAN_HOME_PATH, FAN_PROFILE_PATH } from "../routes";

export function FanBrandBar(): React.JSX.Element {
  return (
    <div className="flex items-center justify-between px-4 pt-2 pb-3">
      <SoftNavLink href={FAN_HOME_PATH} className="font-display text-2xl tracking-wide uppercase">
        {fanCopy.brandPrimary}{" "}
        <span className="bg-accent px-1 text-on-accent">{fanCopy.brandAccent}</span>
      </SoftNavLink>
      <div className="flex items-center gap-2">
        <ThemeModeToggle />
        <SoftNavLink
          href={FAN_PROFILE_PATH}
          className="inline-flex size-9 items-center justify-center border-2 border-line bg-surface"
          aria-label={fanCopy.profile}
        >
          <Icon icon={User} size="md" />
        </SoftNavLink>
      </div>
    </div>
  );
}
