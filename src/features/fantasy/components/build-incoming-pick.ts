import type { PitchSlot } from "../domain/build-pitch-slots";
import { pitchSlotIndex } from "../domain/map-picks-to-pitch-slots";
import type { FantasyFormation } from "@/config/fantasy";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";
import type { PickablePlayer } from "../queries/list-pickable-players";

export function replacePickWithPlayer(
  picks: readonly FantasyPickView[],
  outPlayerId: string,
  player: PickablePlayer,
): FantasyPickView[] {
  return picks.map((p) =>
    p.playerId === outPlayerId
      ? {
          ...p,
          playerId: player.id,
          name: player.name,
          position: player.position,
          photoUrl: player.photoUrl,
          rank: player.rank,
          price: player.price,
          clubTeamId: player.clubTeamId,
          clubName: player.clubName,
        }
      : p,
  );
}

export function addPickToEmptySlot(args: {
  picks: readonly FantasyPickView[];
  player: PickablePlayer;
  formation: FantasyFormation;
  slot: PitchSlot;
}): FantasyPickView[] {
  const index = pitchSlotIndex(args.formation, args.slot.key);
  return [
    ...args.picks,
    {
      playerId: args.player.id,
      name: args.player.name,
      position: args.player.position,
      photoUrl: args.player.photoUrl,
      rank: args.player.rank,
      price: args.player.price,
      clubTeamId: args.player.clubTeamId,
      clubName: args.player.clubName,
      slot: index >= 0 ? index : args.picks.length,
      isBench: args.slot.isBench,
      isCaptain: false,
      isVice: false,
    },
  ];
}
