/** Kit colours for team crests. Stored on teams; not UI theme tokens. */
export const TEAM_COLOR_PALETTE = [
  "#e63946",
  "#1d70b8",
  "#2a9d8f",
  "#f4a100",
  "#2b2d42",
  "#6a4c93",
  "#ff3d00",
  "#1a8a3a",
  /** Near-white — readable on light canvas via crest ink contrast. */
  "#ebe8e0",
] as const;

export type TeamColor = (typeof TEAM_COLOR_PALETTE)[number];

export const DEFAULT_TEAM_COLOR: TeamColor = "#2b2d42";

export function pickTeamColor(used: readonly string[] = []): string {
  const free = TEAM_COLOR_PALETTE.filter(
    (color) => !used.some((taken) => taken.toLowerCase() === color.toLowerCase()),
  );
  const pool = free.length > 0 ? free : TEAM_COLOR_PALETTE;
  return pool[Math.floor(Math.random() * pool.length)] ?? DEFAULT_TEAM_COLOR;
}
