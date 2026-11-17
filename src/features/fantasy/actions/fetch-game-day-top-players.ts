"use server";

import { z } from "zod";

import { listGameDayTopPlayers } from "../queries/list-game-day-top-players";
import type { GameDayTopPlayer } from "../queries/list-game-day-top-players";

/** Top scorers for one Friday, fetched after the squad is already on screen. */
export async function fetchGameDayTopPlayers(gameDayId: string): Promise<GameDayTopPlayer[]> {
  if (!z.uuid().safeParse(gameDayId).success) return [];
  return listGameDayTopPlayers(gameDayId);
}
