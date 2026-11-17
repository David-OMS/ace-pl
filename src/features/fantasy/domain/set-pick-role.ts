export type RolePick = {
  playerId: string;
  isBench: boolean;
  isCaptain: boolean;
  isVice: boolean;
};

/** Captain/vice must be starters and distinct. */
export function setPickRole<T extends RolePick>(
  picks: readonly T[],
  playerId: string,
  role: "captain" | "vice",
): T[] | null {
  const target = picks.find((p) => p.playerId === playerId);
  if (!target || target.isBench) return null;

  return picks.map((pick) => {
    if (role === "captain") {
      return {
        ...pick,
        isCaptain: pick.playerId === playerId,
        isVice: pick.playerId === playerId ? false : pick.isVice,
      };
    }
    return {
      ...pick,
      isVice: pick.playerId === playerId,
      isCaptain: pick.playerId === playerId ? false : pick.isCaptain,
    };
  });
}
