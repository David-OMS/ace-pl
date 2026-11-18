import { FANTASY_TEAM_NAME_MAX_CHANGES } from "@/config/fantasy";

/** Trimmed comparison so "Ace FC" and " ace fc " count as the same name. */
export function normalizeFantasyTeamName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function isSameFantasyTeamName(a: string, b: string): boolean {
  return normalizeFantasyTeamName(a).toLowerCase() === normalizeFantasyTeamName(b).toLowerCase();
}

export function remainingFantasyNameChanges(
  used: number,
  max: number = FANTASY_TEAM_NAME_MAX_CHANGES,
): number {
  return Math.max(0, max - used);
}

export function canChangeFantasyTeamName(
  used: number,
  max: number = FANTASY_TEAM_NAME_MAX_CHANGES,
): boolean {
  return remainingFantasyNameChanges(used, max) > 0;
}
