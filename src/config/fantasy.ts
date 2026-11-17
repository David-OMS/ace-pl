import type { FantasyRank } from "./fantasy-ranks";

export type { FantasyRank } from "./fantasy-ranks";
export { FANTASY_RANKS, rankFromPrice } from "./fantasy-ranks";

/** Fallback / default band prices when a row has no continuous price yet. */
export const FANTASY_RANK_PRICES: Record<FantasyRank, number> = {
  S: 12,
  A: 9,
  B: 7,
  C: 5,
};

/** Locked v1 squad size (1 GK + 6 starters + 2 bench). */
export const FANTASY_SQUAD_SIZE = 9;

/** Migration / new-tournament default; runtime budget lives on tournaments.fantasy_budget. */
export const FANTASY_DEFAULT_BUDGET = 68;

/** Only this account may open or change fantasy prices. */
export const FANTASY_PRICE_ADMIN_ID = "a90018ef-f708-4d44-8a9f-7bed7b2676ef";

export const FANTASY_PRICE_FLOOR = 5;
export const FANTASY_PRICE_CEILING = 20;
export const FANTASY_PRICE_STEP = 0.5;

/** Max ± steps applied in one gameweek evaluation (2 × 0.5 = ±1.0m). */
export const FANTASY_PRICE_MAX_STEPS_PER_GW = 2;

/** Rise when net transfers in ≥ max(min, ceil(activeTeams × this)). */
export const FANTASY_PRICE_RISE_TEAM_SHARE = 0.15;

/** Fall when net transfers out ≥ max(min, ceil(ownership × this)). */
export const FANTASY_PRICE_FALL_OWNERSHIP_SHARE = 0.2;

export const FANTASY_PRICE_MIN_THRESHOLD = 2;

/** Unused free transfers do not carry over. */
export const FANTASY_FREE_TRANSFERS_PER_GW = 1;
export const FANTASY_EXTRA_TRANSFER_HIT = 5;

/** DEF-MID-FWD; GK is always 1. */
export const FANTASY_FORMATIONS = ["2-2-2", "3-2-1", "2-3-1", "3-1-2"] as const;
export type FantasyFormation = (typeof FANTASY_FORMATIONS)[number];

/** Thursday 23:59 before the game day (Africa/Lagos). */
export const FANTASY_DEADLINE_WEEKDAY = 4;
export const FANTASY_DEADLINE_HOUR = 23;
export const FANTASY_DEADLINE_MINUTE = 59;

export const PLAYER_PHOTO_BUCKET = "player-photos";
