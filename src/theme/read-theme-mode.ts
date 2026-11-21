import "server-only";

import { cookies } from "next/headers";

import { THEME_MODE_COOKIE } from "./mode-cookie";
import { DEFAULT_MODE, MODES, type ThemeMode } from "./theme-config";

export async function readThemeMode(): Promise<ThemeMode> {
  const value = (await cookies()).get(THEME_MODE_COOKIE)?.value;
  return MODES.includes(value as ThemeMode) ? (value as ThemeMode) : DEFAULT_MODE;
}
