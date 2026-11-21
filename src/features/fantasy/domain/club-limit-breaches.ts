import { clubsOverLimit } from "./count-club-players";

export type ClubLimitBreach = {
  clubTeamId: string;
  clubName: string;
  count: number;
};

/** Clubs in this squad over the max-3 rule, with display names. */
export function clubLimitBreaches(
  picks: readonly { clubTeamId?: string | null; clubName?: string | null }[],
): ClubLimitBreach[] {
  const nameById = new Map<string, string>();
  for (const pick of picks) {
    if (!pick.clubTeamId) continue;
    if (pick.clubName) nameById.set(pick.clubTeamId, pick.clubName);
  }
  return clubsOverLimit(picks.map((p) => p.clubTeamId)).map((row) => ({
    ...row,
    clubName: nameById.get(row.clubTeamId) ?? "one club",
  }));
}
