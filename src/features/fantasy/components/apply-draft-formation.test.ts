import { applyDraftFormation } from "./apply-draft-formation";

type PickArgs = {
  id: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  slot: number;
  isBench?: boolean;
};

const pick = ({ id, position, slot, isBench = false }: PickArgs) => ({
  playerId: id,
  name: id,
  position,
  photoUrl: null,
  rank: "C" as const,
  price: 5,
  slot,
  isBench,
  isCaptain: false,
  isVice: false,
});

describe("applyDraftFormation", () => {
  it("puts the GK on the GK pitch index, not array order", () => {
    // Missing both DEFs — reseat places FWD/MID/GK then bench leftovers.
    const picks = [
      pick({ id: "f1", position: "FWD", slot: 0 }),
      pick({ id: "m1", position: "MID", slot: 2 }),
      pick({ id: "m2", position: "MID", slot: 3 }),
      pick({ id: "gk", position: "GK", slot: 6 }),
      pick({ id: "b1", position: "FWD", slot: 7, isBench: true }),
    ];
    const next = applyDraftFormation({
      next: "2-2-2",
      picks,
      nameById: new Map(),
    });
    expect(next.find((p) => p.playerId === "gk")?.slot).toBe(6);
    expect(next.find((p) => p.playerId === "m1")?.slot).toBe(2);
    expect(next.find((p) => p.playerId === "f1")?.slot).toBe(0);
  });
});
