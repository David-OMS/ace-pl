"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Icon } from "@/ui/icon";

import { THEME_MODE_COOKIE } from "../mode-cookie";
import { DEFAULT_MODE, MODES, type ThemeMode } from "../theme-config";

function readDomMode(): ThemeMode {
  if (typeof document === "undefined") return DEFAULT_MODE;
  const value = document.documentElement.getAttribute("data-mode");
  return MODES.includes(value as ThemeMode) ? (value as ThemeMode) : DEFAULT_MODE;
}

/** Toggle only — initial mode comes from `<html data-mode>` set in the root layout. */
export function ThemeModeToggle(): React.JSX.Element {
  const [mode, setMode] = useState<ThemeMode>(readDomMode);

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
