import type { PlayerPosition } from "@/config/player-positions";

type PosPoints = Record<PlayerPosition, number>;

/** Per-match fantasy points by position (DECISIONS v1). */
export const FANTASY_SCORING = {
  appearance: { GK: 1, DEF: 1, MID: 1, FWD: 1 } satisfies PosPoints,
  goal: { GK: 7, DEF: 7, MID: 5, FWD: 4 } satisfies PosPoints,
  assist: { GK: 4, DEF: 4, MID: 3, FWD: 3 } satisfies PosPoints,
  cleanSheet: { GK: 4, DEF: 4, MID: 1, FWD: 0 } satisfies PosPoints,
  savesPerPoint: 2,
  savePoint: { GK: 1, DEF: 0, MID: 0, FWD: 0 } satisfies PosPoints,
  penaltySave: { GK: 5, DEF: 0, MID: 0, FWD: 0 } satisfies PosPoints,
  concededPairPenalty: { GK: -1, DEF: -1, MID: 0, FWD: 0 } satisfies PosPoints,
  concededPairSize: 2,
  motm: { GK: 3, DEF: 3, MID: 3, FWD: 3 } satisfies PosPoints,
  yellowCard: { GK: -1, DEF: -1, MID: -1, FWD: -1 } satisfies PosPoints,
  redCard: { GK: -3, DEF: -3, MID: -3, FWD: -3 } satisfies PosPoints,
  ownGoal: { GK: -3, DEF: -3, MID: -3, FWD: -3 } satisfies PosPoints,
} as const;

export type FantasyScoringRow = {
  event: string;
  gk: string;
  def: string;
  mid: string;
  fwd: string;
};

function cell(n: number | null): string {
  if (n === null) return "–";
  if (n > 0) return `+${n}`;
  return String(n);
}

function posRow(event: string, points: PosPoints): FantasyScoringRow {
  return {
    event,
    gk: cell(points.GK),
    def: cell(points.DEF),
    mid: cell(points.MID),
    fwd: cell(points.FWD),
  };
}

function gkOnlyRow(event: string, value: number): FantasyScoringRow {
  return {
    event,
    gk: cell(value),
    def: cell(null),
    mid: cell(null),
    fwd: cell(null),
  };
}

/** Full scoring table for UI (labels only — values from FANTASY_SCORING). */
export function fantasyScoringRows(): FantasyScoringRow[] {
  const s = FANTASY_SCORING;
  return [
    posRow("Appearance", s.appearance),
    posRow("Goal", s.goal),
    posRow("Assist", s.assist),
    posRow("Clean sheet", s.cleanSheet),
    gkOnlyRow(`Every ${s.savesPerPoint} saves`, s.savePoint.GK),
    gkOnlyRow("Penalty save", s.penaltySave.GK),
    posRow(`Every ${s.concededPairSize} goals conceded`, s.concededPairPenalty),
    posRow("Man of the Match", s.motm),
    posRow("Yellow card", s.yellowCard),
    posRow("Red card", s.redCard),
    posRow("Own goal", s.ownGoal),
  ];
}
