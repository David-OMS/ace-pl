import type { PlayerPosition } from "@/config/player-positions";

import { sortPlayers } from "./sort-players";

function buildPlayer(name: string, position: PlayerPosition, isActive = true) {
  return { name, position, isActive };
}

describe("sortPlayers", () => {
  it("orders by position from goalkeeper to forward", () => {
    const sorted = sortPlayers([
      buildPlayer("Femi", "FWD"),
      buildPlayer("Ade", "GK"),
      buildPlayer("Bayo", "MID"),
      buildPlayer("Chidi", "DEF"),
    ]);

    expect(sorted.map((p) => p.position)).toEqual(["GK", "DEF", "MID", "FWD"]);
  });

  it("sorts names alphabetically within a position, ignoring case", () => {
    const sorted = sortPlayers([buildPlayer("tobi", "MID"), buildPlayer("Seyi", "MID")]);

    expect(sorted.map((p) => p.name)).toEqual(["Seyi", "tobi"]);
  });

  it("puts inactive players after everyone active", () => {
    const sorted = sortPlayers([buildPlayer("Old Keeper", "GK", false), buildPlayer("Zed", "FWD")]);

    expect(sorted.map((p) => p.name)).toEqual(["Zed", "Old Keeper"]);
  });

  it("leaves the input list untouched", () => {
    const players = [buildPlayer("B", "FWD"), buildPlayer("A", "GK")];

    sortPlayers(players);

    expect(players.map((p) => p.name)).toEqual(["B", "A"]);
  });
});
