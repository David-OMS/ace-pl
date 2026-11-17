import { buildPitchSlots } from "./build-pitch-slots";

describe("buildPitchSlots", () => {
  it("builds 2-2-2 starters plus bench for squad size 9", () => {
    const slots = buildPitchSlots("2-2-2", 9);
    expect(slots.filter((s) => !s.isBench)).toHaveLength(7);
    expect(slots.filter((s) => s.isBench)).toHaveLength(2);
    expect(slots.filter((s) => s.line === "FWD")).toHaveLength(2);
    expect(slots.filter((s) => s.line === "GK")).toHaveLength(1);
  });

  it("builds 3-1-2 correctly", () => {
    const slots = buildPitchSlots("3-1-2", 9);
    expect(slots.filter((s) => s.line === "DEF" && !s.isBench)).toHaveLength(3);
    expect(slots.filter((s) => s.line === "MID" && !s.isBench)).toHaveLength(1);
    expect(slots.filter((s) => s.line === "FWD" && !s.isBench)).toHaveLength(2);
  });
});
