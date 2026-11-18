import { mapPicksToPitchSlots, pitchSlotIndex } from "./map-picks-to-pitch-slots";

describe("mapPicksToPitchSlots", () => {
  it("keeps remaining players visible when one slot is empty", () => {
    const picks = [
      { playerId: "gk", slot: 6, isBench: false },
      { playerId: "d1", slot: 4, isBench: false },
      { playerId: "d2", slot: 5, isBench: false },
    ];
    const { pickBySlotKey, slots } = mapPicksToPitchSlots("2-2-2", picks);
    expect(pickBySlotKey.get("GK-0")?.playerId).toBe("gk");
    expect(pickBySlotKey.get("DEF-0")?.playerId).toBe("d1");
    expect(pickBySlotKey.get("DEF-1")?.playerId).toBe("d2");
    expect(pickBySlotKey.size).toBe(3);
    expect(slots).toHaveLength(9);
  });

  it("finds the global index for an empty slot key", () => {
    expect(pitchSlotIndex("2-2-2", "DEF-0")).toBe(4);
  });
});
