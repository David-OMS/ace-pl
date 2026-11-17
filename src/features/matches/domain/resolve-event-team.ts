type ParticipationRef = { playerId: string; teamId: string };

/** Which team an event counts for — the team that player lined up with. */
export function resolveEventTeam(
  playerId: string,
  participations: readonly ParticipationRef[],
): string | null {
  return participations.find((row) => row.playerId === playerId)?.teamId ?? null;
}
