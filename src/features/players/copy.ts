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
  tabs: {
    aria: "Players sections",
    list: "List",
    prices: "Prices",
  },
  pricesTitle: "Player prices",
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
      "Send this to the player. They sign up on the page, see their name, then the link connects their account. It works once.",
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
    hey: (name: string): string => `Hey ${name}`,
    signUp: "Please sign up with your mail below.",
    alreadySignedUp: "Already have an account? Sign in.",
    confirm: "This is me",
    linking: "Linking…",
    invalid: "That link is no longer valid. Ask an admin for a new one.",
  },
  photo: {
    add: "Upload your picture",
    change: "Change picture",
    face: "Just your face.",
    gag: "No picture and you look like a default face with no scan.",
    save: "Save picture",
    saving: "Saving…",
    saved: "Picture saved.",
    remove: "Remove picture",
    removing: "Removing…",
    removed: "Picture removed.",
    takePhoto: "Take a photo",
    choosePhoto: "Choose a photo",
    openingCamera: "Opening camera…",
    cropHint: "Drag to move. Use the slider to zoom.",
    zoom: "Zoom",
    useCrop: "Use this",
    cropping: "Cropping…",
    cancelCrop: "Cancel",
    skip: "Keep the default face",
    wrongType: "Use a JPEG, PNG or WebP under 2 MB.",
  },
  actionErrors: {
    invalid_input: "Check that and try again.",
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
