import { FANTASY_SQUAD_SIZE, type FantasyFormation } from "@/config/fantasy";

import { pitchSlotIndex } from "../domain/map-picks-to-pitch-slots";
import { reseatPicksForFormation } from "../domain/reseat-picks-for-formation";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";

type ReseatRow = {
  playerId: string;
  position: FantasyPickView["position"];
  price: number;
  isBench: boolean;
  slotKey: string;
};

function pickName(
  prior: FantasyPickView | undefined,
  playerId: string,
  nameById: ReadonlyMap<string, string>,
): string {
  if (prior) return prior.name;
  return nameById.get(playerId) ?? "?";
}

function toPickView(
  row: ReseatRow,
  prior: FantasyPickView | undefined,
  args: {
    formation: FantasyFormation;
    nameById: ReadonlyMap<string, string>;
    captainId: string | undefined;
    viceId: string | undefined;
  },
): FantasyPickView {
  const slot = pitchSlotIndex(args.formation, row.slotKey);
  const starter = !row.isBench;
  return {
    playerId: row.playerId,
    name: pickName(prior, row.playerId, args.nameById),
    position: row.position,
    photoUrl: prior ? prior.photoUrl : null,
    rank: prior ? prior.rank : "C",
    price: row.price,
    slot: slot >= 0 ? slot : 0,
    isBench: row.isBench,
    isCaptain: starter && row.playerId === args.captainId,
    isVice: starter && row.playerId === args.viceId,
  };
}

export function applyDraftFormation(args: {
  next: FantasyFormation;
  picks: readonly FantasyPickView[];
  nameById: ReadonlyMap<string, string>;
}): FantasyPickView[] {
  const captainId = args.picks.find((p) => p.isCaptain)?.playerId;
  const viceId = args.picks.find((p) => p.isVice)?.playerId;

  const reseated = reseatPicksForFormation({
    formation: args.next,
    squadSize: FANTASY_SQUAD_SIZE,
    picks: args.picks.map((p) => ({
      playerId: p.playerId,
      position: p.position,
      price: p.price,
      isCaptain: p.isCaptain,
      isVice: p.isVice,
    })),
  });

  const placed = reseated.map((row) =>
    toPickView(
      row,
      args.picks.find((x) => x.playerId === row.playerId),
      {
        formation: args.next,
        nameById: args.nameById,
        captainId,
        viceId,
      },
    ),
  );

  const placedIds = new Set(placed.map((p) => p.playerId));
  const leftovers = args.picks
    .filter((p) => !placedIds.has(p.playerId))
    .map((p, offset) => ({
      ...p,
      isCaptain: false,
      isVice: false,
      isBench: true,
      slot: FANTASY_SQUAD_SIZE + offset,
    }));

  return [...placed, ...leftovers];
}
