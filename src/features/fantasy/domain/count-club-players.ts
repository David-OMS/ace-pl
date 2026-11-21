import { FANTASY_MAX_PER_CLUB } from "@/config/fantasy";

/** How many picks belong to each real club (skips unassigned players). */
export function countClubPlayers(
  clubTeamIds: readonly (string | null | undefined)[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const clubId of clubTeamIds) {
    if (!clubId) continue;
    counts.set(clubId, (counts.get(clubId) ?? 0) + 1);
  }
  return counts;
}

export function clubsOverLimit(
  clubTeamIds: readonly (string | null | undefined)[],
  maxPerClub: number = FANTASY_MAX_PER_CLUB,
): { clubTeamId: string; count: number }[] {
  const over: { clubTeamId: string; count: number }[] = [];
  for (const [clubTeamId, count] of countClubPlayers(clubTeamIds)) {
    if (count > maxPerClub) over.push({ clubTeamId, count });
  }
  return over;
}

export function squadRespectsClubLimit(
  clubTeamIds: readonly (string | null | undefined)[],
  maxPerClub: number = FANTASY_MAX_PER_CLUB,
): boolean {
  return clubsOverLimit(clubTeamIds, maxPerClub).length === 0;
}
