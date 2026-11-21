"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Icon } from "@/ui/icon";

import { THEME_MODE_COOKIE } from "../mode-cookie";
import { DEFAULT_MODE, MODES, type ThemeMode } from "../theme-config";

type ThemeModeToggleProps = {
  initialMode?: ThemeMode;
};

/** Toggle only — `initialMode` must match `<html data-mode>` from the root layout. */
export function ThemeModeToggle({
  initialMode = DEFAULT_MODE,
}: ThemeModeToggleProps): React.JSX.Element {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
    document.cookie = `${THEME_MODE_COOKIE}=${mode};path=/;max-age=31536000;samesite=lax`;
  }, [mode]);

  const next = mode === "dark" ? "light" : "dark";
  const label = next === "dark" ? "Dark mode" : "Light mode";

  return (
    <button
      type="button"
      className="inline-flex size-9 items-center justify-center border-2 border-line bg-surface"
      aria-label={label}
      onClick={() => setMode(MODES.includes(next) ? next : "light")}
    >
      <Icon icon={mode === "dark" ? Sun : Moon} size="md" />
    </button>
  );
}
