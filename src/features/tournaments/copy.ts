import type { FirstPlaceTiebreak, KeeperMode, TournamentStatus } from "@/config/tournament-rules";
import type { ActionErrorCode } from "@/lib/action-result";

export const tournamentsCopy = {
  adminTitle: "Tournaments",
  newTournament: "New tournament",
  backToTournaments: "All tournaments",
  emptyList: "No tournaments yet.",
  form: {
    name: "Name",
    namePlaceholder: "November 2026",
    startsOn: "Start date",
    endsOn: "End date",
    playersOnPitch: "Players on pitch",
    squadSize: "Players per team",
    matchesPerGameDay: "Matches per game day",
    firstPlaceTiebreak: "1st place tiebreak",
    keeperMode: "Goalkeepers",
    create: "Create tournament",
    save: "Save settings",
    saving: "Saving…",
    saved: "Saved.",
  },
  settingsTitle: "Settings",
  settingsLink: "Settings",
  statusAutoHint: "Status updates itself from setup → in progress → finished.",
  deleteTournament: "Delete tournament",
  deletingTournament: "Deleting…",
  deleteTournamentHint: "Deletes teams, fixtures and match data for this tournament.",
  workspace: {
    rosterTitle: "Manage players",
    rosterIntro: "Select who is in this tournament, then save.",
    rosterEmpty: "No players selected yet.",
    search: "Search",
    searchPlaceholder: "Name or position",
    selectedCount: (n: number): string => (n === 1 ? "1 player selected" : `${n} players selected`),
    save: "Save players",
    saving: "Saving…",
    managePlayers: "Manage players",
    createTeams: "Create team",
    manageFixtures: "Manage fixtures",
    teamsTitle: "Teams",
    teamsEmpty: "No teams yet.",
    unassignedTitle: "Unassigned",
    unassignedEmpty: "Everyone is in a team.",
    sharedKeepersLink: "Shared keepers",
    openTeam: "Open",
  },
  statuses: {
    setup: "Setting up",
    active: "In progress",
    completed: "Finished",
  } satisfies Record<TournamentStatus, string>,
  tiebreaks: {
    discipline: "Fewest discipline points",
    playoff: "Playoff match",
  } satisfies Record<FirstPlaceTiebreak, string>,
  keeperModes: {
    per_team: "Each team has its own",
    shared: "Shared pool for the tournament",
  } satisfies Record<KeeperMode, string>,
  sharedKeepers: {
    title: "Shared keepers",
    empty: "No keepers selected.",
    pick: "Keeper",
    add: "Add",
    remove: "Remove",
  },
  gameDays: {
    title: "Game days",
    empty: "No game days yet.",
    dateLabel: "Date",
    add: "Add",
    remove: (date: string): string => `Remove ${date}`,
    removeBlocked: "Couldn't remove. If matches are already on that day, remove those first.",
  },
  actionErrors: {
    invalid_input: "Some values are missing or out of range.",
    unauthenticated: "Your session has ended. Sign in again.",
    forbidden: "Only admins can do that.",
    not_found: "That tournament no longer exists.",
    conflict: "That's already on the list.",
    save_failed: "Couldn't save. Try again.",
  } satisfies Partial<Record<ActionErrorCode, string>>,
  fallbackError: "Something went wrong. Try again.",
} as const;

export function describeTournamentsError(code: ActionErrorCode): string {
  const messages: Partial<Record<ActionErrorCode, string>> = tournamentsCopy.actionErrors;
  return messages[code] ?? tournamentsCopy.fallbackError;
}
