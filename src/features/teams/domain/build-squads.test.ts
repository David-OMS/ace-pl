import type { PlayerPosition } from "@/config/player-positions";
import type { PlayerSummary } from "@/features/players";

import { buildSquads } from "./build-squads";

function buildPlayer(id: string, position: PlayerPosition = "MID", isActive = true): PlayerSummary {
  return { id, name: id, position, isActive, isClaimed: false };
}

const TEAMS = [
  { id: "t-red", name: "Red" },
  { id: "t-blue", name: "Blue" },
];

describe("buildSquads", () => {
  it("lists teams alphabetically with players in pitch order", () => {
    const setup = buildSquads({
      teams: TEAMS,
      memberships: [
        { teamId: "t-red", playerId: "striker", isCaptain: false },
        { teamId: "t-red", playerId: "keeper", isCaptain: true },
      ],
      players: [buildPlayer("striker", "FWD"), buildPlayer("keeper", "GK")],
      squadSize: 8,
    });

    expect(setup.squads.map((s) => s.teamName)).toEqual(["Blue", "Red"]);
    expect(setup.squads[1]?.players.map((p) => p.id)).toEqual(["keeper", "striker"]);
    expect(setup.squads[1]?.players[0]?.isCaptain).toBe(true);
  });

  it("counts open spots and goes negative when a squad is too big", () => {
    const setup = buildSquads({
      teams: [{ id: "t-red", name: "Red" }],
      memberships: ["a", "b", "c"].map((playerId) => ({
        teamId: "t-red",
        playerId,
        isCaptain: false,
      })),
      players: ["a", "b", "c"].map((id) => buildPlayer(id)),
      squadSize: 2,
    });

    expect(setup.squads[0]?.openSpots).toBe(-1);
  });

  it("gives an empty team all its spots", () => {
    const setup = buildSquads({ teams: TEAMS, memberships: [], players: [], squadSize: 10 });

    expect(setup.squads.map((s) => s.openSpots)).toEqual([10, 10]);
  });

  it("puts players without a team in the unassigned pool", () => {
    const setup = buildSquads({
      teams: TEAMS,
      memberships: [{ teamId: "t-blue", playerId: "in-team", isCaptain: false }],
      players: [
        buildPlayer("in-team"),
        buildPlayer("free"),
        buildPlayer("also-free", "MID", false),
      ],
      squadSize: 10,
    });

    expect(setup.unassigned.map((p) => p.id)).toEqual(["free", "also-free"]);
  });

  it("keeps excluded players out of the unassigned pool", () => {
    const setup = buildSquads({
      teams: TEAMS,
      memberships: [],
      players: [buildPlayer("free"), buildPlayer("shared-gk", "GK")],
      squadSize: 10,
      excludeFromUnassigned: ["shared-gk"],
    });

    expect(setup.unassigned.map((p) => p.id)).toEqual(["free"]);
  });

  it("treats memberships for missing teams as unassigned", () => {
    const setup = buildSquads({
      teams: TEAMS,
      memberships: [{ teamId: "gone", playerId: "orphan", isCaptain: false }],
      players: [buildPlayer("orphan", "MID"), buildPlayer("free")],
      squadSize: 10,
    });

    expect(setup.unassigned.map((p) => p.id)).toEqual(["free", "orphan"]);
  });

  it("keeps an inactive player in the squad they were already in", () => {
    const setup = buildSquads({
      teams: [{ id: "t-red", name: "Red" }],
      memberships: [{ teamId: "t-red", playerId: "injured", isCaptain: false }],
      players: [buildPlayer("injured", "DEF", false)],
      squadSize: 10,
    });

    expect(setup.squads[0]?.players.map((p) => p.id)).toEqual(["injured"]);
  });

  it("ignores memberships for players it doesn't know about", () => {
    const setup = buildSquads({
      teams: [{ id: "t-red", name: "Red" }],
      memberships: [{ teamId: "t-red", playerId: "ghost", isCaptain: false }],
      players: [],
      squadSize: 10,
    });

    expect(setup.squads[0]?.players).toEqual([]);
  });
});
