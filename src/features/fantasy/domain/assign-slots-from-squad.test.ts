import { assignSlotsFromSquad } from "./assign-slots-from-squad";

type PickArgs = {
  playerId: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  isBench: boolean;
  isCaptain?: boolean;
  isVice?: boolean;
};

const pick = ({ playerId, position, isBench, isCaptain = false, isVice = false }: PickArgs) => ({
  playerId,
  position,
  price: 5,
  isBench,
  isCaptain,
  isVice,
});

describe("assignSlotsFromSquad", () => {
  it("puts the GK on the GK pitch index regardless of array order", () => {
    const slotted = assignSlotsFromSquad({
      formation: "2-3-1",
      squadSize: 9,
      picks: [
        pick({ playerId: "def1", position: "DEF", isBench: false }),
        pick({ playerId: "gk", position: "GK", isBench: false, isCaptain: true }),
        pick({ playerId: "fwd", position: "FWD", isBench: false }),
        pick({ playerId: "m1", position: "MID", isBench: false, isVice: true }),
        pick({ playerId: "m2", position: "MID", isBench: false }),
        pick({ playerId: "m3", position: "MID", isBench: false }),
        pick({ playerId: "def2", position: "DEF", isBench: false }),
        pick({ playerId: "b1", position: "FWD", isBench: true }),
        pick({ playerId: "b2", position: "MID", isBench: true }),
      ],
    });
    expect(slotted).not.toBeNull();
    expect(slotted?.find((p) => p.playerId === "gk")).toMatchObject({
      slot: 6,
      slotKey: "GK-0",
      isBench: false,
      isCaptain: true,
    });
    expect(slotted?.find((p) => p.playerId === "fwd")?.slotKey).toBe("FWD-0");
    expect(slotted?.filter((p) => p.isBench).map((p) => p.playerId)).toEqual(["b1", "b2"]);
  });

  it("returns null when a starter position is missing", () => {
    const slotted = assignSlotsFromSquad({
      formation: "2-2-2",
      squadSize: 9,
      picks: [
        pick({ playerId: "gk", position: "GK", isBench: false }),
        pick({ playerId: "d1", position: "DEF", isBench: false }),
        pick({ playerId: "m1", position: "MID", isBench: false }),
        pick({ playerId: "m2", position: "MID", isBench: false }),
        pick({ playerId: "f1", position: "FWD", isBench: false }),
        pick({ playerId: "f2", position: "FWD", isBench: false }),
        pick({ playerId: "extra", position: "MID", isBench: false }),
        pick({ playerId: "b1", position: "DEF", isBench: true }),
        pick({ playerId: "b2", position: "MID", isBench: true }),
      ],
    });
    expect(slotted).toBeNull();
  });
});
