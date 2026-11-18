"use client";

import { useMemo, useState } from "react";

import { FANTASY_SQUAD_SIZE, type FantasyFormation } from "@/config/fantasy";

import { affordableReplacements } from "../domain/affordable-replacements";
import { allowedFantasyFormations } from "../domain/allowed-fantasy-formations";
import { applyTransferBatch } from "../domain/apply-transfer";
import { blockedFormationMessage } from "../domain/blocked-formation-message";
import type { PitchSlot } from "../domain/build-pitch-slots";
import { canSwapPitchPicks } from "../domain/can-swap-pitch-picks";
import { listSwapTargets } from "../domain/list-swap-targets";
import { pitchSlotIndex } from "../domain/map-picks-to-pitch-slots";
import { isFantasyFormation } from "../domain/parse-formation";
import { picksFingerprint } from "../domain/picks-fingerprint";
import { setPickRole } from "../domain/set-pick-role";
import { swapPitchPicks } from "../domain/swap-pitch-picks";
import type { FantasyPickView, MyFantasyTeam } from "../queries/get-my-fantasy-team";
import type { PickablePlayer } from "../queries/list-pickable-players";
import { applyDraftFormation } from "./apply-draft-formation";

export type SwapDraft = { playerOutId: string; playerInId: string };

export type TransferDraft = {
  formation: FantasyFormation;
  setFormation: (formation: FantasyFormation) => void;
  reportBlockedFormation: (formation: FantasyFormation) => void;
  clearFormationError: () => void;
  formationError: string | null;
  allowedFormations: ReadonlySet<FantasyFormation>;
  picks: FantasyPickView[];
  swaps: SwapDraft[];
  bank: number;
  activeOut: FantasyPickView | null;
  activeEmpty: PitchSlot | null;
  replacing: boolean;
  swapTargetIds: ReadonlySet<string>;
  swapTargetNames: readonly string[];
  lastSwapFlash: string | null;
  clearSwapFlash: () => void;
  openOut: (pick: FantasyPickView) => void;
  openEmpty: (slot: PitchSlot) => void;
  openReplace: () => void;
  clearOut: () => void;
  removeOut: () => void;
  setCaptain: () => void;
  setVice: () => void;
  pickIn: (player: PickablePlayer) => void;
  inOptions: PickablePlayer[];
  preview: ReturnType<typeof applyTransferBatch>;
  nameById: Map<string, string>;
  isUnlimited: boolean;
  lineupDirty: boolean;
};

// eslint-disable-next-line max-lines-per-function, complexity -- transfer draft actions stay together
export function useTransferDraft(args: {
  team: MyFantasyTeam;
  pool: readonly PickablePlayer[];
  budget: number;
  isUnlimited: boolean;
}): TransferDraft {
  const { team, pool, budget, isUnlimited } = args;
  const initialFormation = isFantasyFormation(team.formation) ? team.formation : "2-2-2";
  const [formation, setFormationState] = useState<FantasyFormation>(initialFormation);
  const [picks, setPicks] = useState(team.picks);
  const [swaps, setSwaps] = useState<SwapDraft[]>([]);
  const [activeOut, setActiveOut] = useState<FantasyPickView | null>(null);
  const [activeEmpty, setActiveEmpty] = useState<PitchSlot | null>(null);
  const [replacing, setReplacing] = useState(false);
  const [lastSwapFlash, setLastSwapFlash] = useState<string | null>(null);
  const [formationError, setFormationError] = useState<string | null>(null);

  const priceById = useMemo(() => new Map(pool.map((p) => [p.id, p.price])), [pool]);
  const nameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of pool) map.set(p.id, p.name);
    for (const p of team.picks) map.set(p.playerId, p.name);
    return map;
  }, [pool, team.picks]);

  const preview = applyTransferBatch(
    { bank: team.bank, freeTransfers: team.freeTransfers, isUnlimited },
    swaps.map((s) => ({
      outPrice: priceById.get(s.playerOutId) ?? 0,
      inPrice: priceById.get(s.playerInId) ?? 0,
    })),
  );
  const spent = picks.reduce((sum, p) => sum + p.price, 0);
  const bank = isUnlimited ? budget - spent : preview.ok ? preview.value.bank : team.bank;

  const ownedIds = useMemo(() => new Set(picks.map((p) => p.playerId)), [picks]);
  const positions = picks.map((p) => p.position);
  // Grey only when the squad is full; empty slots = still building (like create).
  const allowedFormations = useMemo(
    () => allowedFantasyFormations(positions, FANTASY_SQUAD_SIZE),
    [positions],
  );

  const selecting = Boolean((activeOut && replacing) || activeEmpty);
  const maxPrice = activeOut ? bank + activeOut.price : bank;
  const outPosition = activeOut?.position ?? activeEmpty?.position ?? "MID";
  const isBench = activeOut?.isBench ?? activeEmpty?.isBench ?? false;
  // Starter holes = that position only (same as create). Bench = any outfield.
  const inOptions = selecting
    ? affordableReplacements({
        pool,
        ownedIds,
        outPosition,
        maxPrice,
        samePositionOnly: !isBench,
        excludeGoalkeepers: isBench,
      })
    : [];

  const lineupDirty = picksFingerprint(picks) !== picksFingerprint(team.picks);
  const swapTargets = activeOut ? listSwapTargets(activeOut, picks) : [];
  const swapTargetIds = new Set(swapTargets.map((p) => p.playerId));
  const swapTargetNames = swapTargets.map((p) => p.name);

  return {
    formation,
    setFormation: (next) => {
      if (!allowedFormations.has(next)) return;
      setFormationError(null);
      setFormationState(next);
      setPicks(applyDraftFormation({ next, picks, nameById }));
      setActiveOut(null);
      setActiveEmpty(null);
      setReplacing(false);
    },
    reportBlockedFormation: (next) => {
      setFormationError(blockedFormationMessage(next, positions));
      setActiveOut(null);
      setActiveEmpty(null);
      setReplacing(false);
    },
    clearFormationError: () => setFormationError(null),
    formationError,
    allowedFormations,
    picks,
    swaps,
    bank,
    activeOut,
    activeEmpty,
    replacing,
    swapTargetIds,
    swapTargetNames,
    lastSwapFlash,
    clearSwapFlash: () => setLastSwapFlash(null),
    openOut: (pick) => {
      if (activeOut?.playerId === pick.playerId) {
        setActiveOut(null);
        setReplacing(false);
        setLastSwapFlash(null);
        return;
      }
      if (activeOut && canSwapPitchPicks(activeOut, pick)) {
        const next = swapPitchPicks(picks, activeOut.playerId, pick.playerId);
        if (next) {
          setPicks(next);
          setLastSwapFlash(`${activeOut.name}|${pick.name}`);
        }
        setActiveOut(null);
        setReplacing(false);
        return;
      }
      setActiveEmpty(null);
      setReplacing(false);
      setLastSwapFlash(null);
      setActiveOut(pick);
    },
    openEmpty: (slot) => {
      if (!isUnlimited) return;
      setFormationError(null);
      setActiveOut(null);
      setReplacing(false);
      setActiveEmpty(slot);
    },
    openReplace: () => {
      if (!activeOut) return;
      setReplacing(true);
    },
    clearOut: () => {
      setActiveOut(null);
      setActiveEmpty(null);
      setReplacing(false);
    },
    removeOut: () => {
      if (!isUnlimited || !activeOut) return;
      setFormationError(null);
      setPicks(picks.filter((p) => p.playerId !== activeOut.playerId));
      setActiveOut(null);
      setReplacing(false);
    },
    setCaptain: () => {
      if (!activeOut) return;
      const next = setPickRole(picks, activeOut.playerId, "captain");
      if (!next) return;
      setPicks(next);
      setActiveOut(next.find((p) => p.playerId === activeOut.playerId) ?? null);
    },
    setVice: () => {
      if (!activeOut) return;
      const next = setPickRole(picks, activeOut.playerId, "vice");
      if (!next) return;
      setPicks(next);
      setActiveOut(next.find((p) => p.playerId === activeOut.playerId) ?? null);
    },
    pickIn: (player) => {
      let next = picks;
      if (activeOut) {
        if (!isUnlimited) {
          setSwaps([...swaps, { playerOutId: activeOut.playerId, playerInId: player.id }]);
        }
        next = picks.map((p) =>
          p.playerId === activeOut.playerId
            ? {
                ...p,
                playerId: player.id,
                name: player.name,
                position: player.position,
                photoUrl: player.photoUrl,
                rank: player.rank,
                price: player.price,
              }
            : p,
        );
      } else if (activeEmpty && isUnlimited) {
        const slot = pitchSlotIndex(formation, activeEmpty.key);
        next = [
          ...picks,
          {
            playerId: player.id,
            name: player.name,
            position: player.position,
            photoUrl: player.photoUrl,
            rank: player.rank,
            price: player.price,
            slot: slot >= 0 ? slot : picks.length,
            isBench: activeEmpty.isBench,
            isCaptain: false,
            isVice: false,
          },
        ];
      }
      // Full pre-deadline squad: snap everyone onto the real formation lines.
      if (isUnlimited && next.length >= FANTASY_SQUAD_SIZE) {
        next = applyDraftFormation({ next: formation, picks: next, nameById });
      }
      setPicks(next);
      setActiveOut(null);
      setActiveEmpty(null);
      setReplacing(false);
    },
    inOptions,
    preview,
    nameById,
    isUnlimited,
    lineupDirty,
  };
}
