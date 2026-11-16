export const THEMES = ["street", "retro"] as const;
export const MODES = ["light", "dark"] as const;

export type ThemeName = (typeof THEMES)[number];
export type ThemeMode = (typeof MODES)[number];

export const DEFAULT_THEME: ThemeName = "street";
export const DEFAULT_MODE: ThemeMode = "light";
