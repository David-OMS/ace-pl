import type { PlayerPosition } from "@/config/player-positions";

import { applyFantasyAutoSubs } from "./apply-fantasy-auto-subs";

export type GameweekSquadPick = {
  playerId: string;
  position: PlayerPosition;
  isBench: boolean;
  isCaptain: boolean;
  isVice: boolean;
  slot: number;
};

export type PlayerDayPoints = {
  playerId: string;
  rawPoints: number;
  played: boolean;
};

export type ScoredGameweekPick = {
  playerId: string;
  slot: number;
  isBench: boolean;
  isCaptain: boolean;
  isVice: boolean;
  rawPoints: number;
  appliedPoints: number;
  inXi: boolean;
};

export type ScoredGameweekTeam = {
  points: number;
  picks: ScoredGameweekPick[];
};

/** Auto-subs + captain/vice double for one team's gameweek. */
export function scoreFantasyGameweekTeam(
  squad: readonly GameweekSquadPick[],
  dayPoints: readonly PlayerDayPoints[],
): ScoredGameweekTeam {
  const byId = new Map(dayPoints.map((p) => [p.playerId, p]));
  const playedIds = new Set(dayPoints.filter((p) => p.played).map((p) => p.playerId));

  const inXi = applyFantasyAutoSubs(
    squad.map((p) => ({
      playerId: p.playerId,
      position: p.position,
      isBench: p.isBench,
      benchOrder: p.slot,
    })),
    playedIds,
  );

  const captain = squad.find((p) => p.isCaptain);
  const vice = squad.find((p) => p.isVice);
  const captainPlayed = captain ? playedIds.has(captain.playerId) : false;
  const vicePlayed = vice ? playedIds.has(vice.playerId) : false;
  const doubleId =
    captain && captainPlayed && inXi.has(captain.playerId)
      ? captain.playerId
      : vice && vicePlayed && inXi.has(vice.playerId)
        ? vice.playerId
        : null;

  const picks: ScoredGameweekPick[] = squad.map((pick) => {
    const day = byId.get(pick.playerId);
    const raw = day?.rawPoints ?? 0;
    const starting = inXi.has(pick.playerId);
    let applied = starting ? raw : 0;
    if (doubleId === pick.playerId) applied = raw * 2;
    return {
      playerId: pick.playerId,
      slot: pick.slot,
      isBench: pick.isBench,
      isCaptain: pick.isCaptain,
      isVice: pick.isVice,
      rawPoints: raw,
      appliedPoints: applied,
      inXi: starting,
    };
  });

  const points = picks.reduce((sum, p) => sum + p.appliedPoints, 0);
  return { points, picks };
}
