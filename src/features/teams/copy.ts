import type { ActionErrorCode } from "@/lib/action-result";

export const teamsCopy = {
  title: "Teams",
  createTitle: "Create team",
  emptyTeams: "No teams yet.",
  emptySquad: "No players in this team yet.",
  emptyUnassigned: "Everyone is in a team.",
  unassigned: "Unassigned",
  deleteTeam: "Delete team",
  removeTeam: (name: string): string => `Delete ${name}`,
  openSpots: (n: number): string => (n === 1 ? "1 spot left" : `${n} spots left`),
  overfilled: (n: number): string => `${Math.abs(n)} over`,
  full: "Full",
  captain: "Captain",
  makeCaptain: "Make captain",
  addPlayers: "Add players",
  confirmAddPlayers: "Add to team",
  searchPlayers: "Search players",
  searchPlaceholder: "Name or position",
  pickedCount: (n: number, max: number): string => `${n} / ${max} selected`,
  cancelPicking: "Cancel",
  donePicking: "Done",
  saveAndAnother: "Save and create another",
  saveAndDone: "Save team",
  removeFromTeam: "Remove",
  kitColor: "Kit colour",
  kitColorOption: (hex: string): string => `Set kit colour ${hex}`,
  form: {
    name: "Team name",
    namePlaceholder: "Team A",
    add: "Add team",
    adding: "Adding…",
  },
  assign: {
    label: "Move to",
    none: "Unassigned",
    saving: "Moving…",
  },
  actionErrors: {
    invalid_input: "Check the team name or selection. Squad may be full.",
    unauthenticated: "Your session has ended. Sign in again.",
    forbidden: "Only admins can do that.",
    not_found: "That player isn't in this team.",
    conflict: "A team with that name already exists.",
    save_failed: "Couldn't save. If the team is on a fixture, remove those first.",
  } satisfies Partial<Record<ActionErrorCode, string>>,
  fallbackError: "Something went wrong. Try again.",
} as const;

export function describeTeamsError(code: ActionErrorCode): string {
  const messages: Partial<Record<ActionErrorCode, string>> = teamsCopy.actionErrors;
  return messages[code] ?? teamsCopy.fallbackError;
}
