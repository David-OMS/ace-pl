import type { PlayerPosition } from "@/config/player-positions";
import type { ActionErrorCode } from "@/lib/action-result";

export const playersCopy = {
  adminTitle: "Players",
  addPlayer: "Add player",
  newPlayerTitle: "New player",
  editPlayerTitle: "Edit player",
  backToPlayers: "All players",
  emptyList: "No players yet. Add the regulars first; borrowed players can be added on match day.",
  claimed: "Linked",
  filter: {
    position: "Position",
    all: "All positions",
  },
  form: {
    name: "Name",
    position: "Position",
    create: "Add player",
    save: "Save",
    saving: "Saving…",
    saved: "Saved.",
  },
  positions: {
    GK: "Goalkeeper",
    DEF: "Defender",
    MID: "Midfielder",
    FWD: "Forward",
  } satisfies Record<PlayerPosition, string>,
  claimLink: {
    title: "Claim link",
    intro:
      "Send this to the player. Opening it while signed in links their account to this player. It works once.",
    copy: "Copy link",
    copied: "Copied",
    reset: "Make a new link",
    resetting: "Making…",
    resetHint: "The old link stops working.",
    linkedTo: (name: string): string => `Linked to ${name}'s account.`,
    missing: "No link available. Make a new one.",
  },
  claimPage: {
    title: "Link your player profile",
    intro: "This connects your account to your player, so your stats and photo show up as yours.",
    confirm: "Link my account",
    linking: "Linking…",
    signInFirst: "Sign in first, then come back to this link.",
    signIn: "Sign in",
  },
  actionErrors: {
    invalid_input: "Check the name and position.",
    unauthenticated: "Your session has ended. Sign in again.",
    forbidden: "Only admins can do that.",
    not_found: "That link is no longer valid. Ask an admin for a new one.",
    conflict: "Your account is already linked to a player.",
    save_failed: "Couldn't save. Try again.",
  } satisfies Partial<Record<ActionErrorCode, string>>,
  fallbackError: "Something went wrong. Try again.",
} as const;

export function describePlayersError(code: ActionErrorCode): string {
  const messages: Partial<Record<ActionErrorCode, string>> = playersCopy.actionErrors;
  return messages[code] ?? playersCopy.fallbackError;
}
