import { canSwapPitchPicks } from "./can-swap-pitch-picks";
import { swapPitchPicks } from "./swap-pitch-picks";

describe("canSwapPitchPicks", () => {
  it("allows same-position starter and bench", () => {
    expect(
      canSwapPitchPicks(
        { playerId: "a", position: "DEF", isBench: false },
        { playerId: "b", position: "DEF", isBench: true },
      ),
    ).toBe(true);
  });

  it("rejects different positions or two starters", () => {
    expect(
      canSwapPitchPicks(
        { playerId: "a", position: "DEF", isBench: false },
        { playerId: "b", position: "MID", isBench: true },
      ),
    ).toBe(false);
    expect(
      canSwapPitchPicks(
        { playerId: "a", position: "DEF", isBench: false },
        { playerId: "b", position: "DEF", isBench: false },
      ),
    ).toBe(false);
  });
});

describe("swapPitchPicks", () => {
  it("swaps bench flags and strips captain from the benched player", () => {
    const result = swapPitchPicks(
      [
        {
          playerId: "a",
          position: "DEF" as const,
          isBench: false,
          isCaptain: true,
          isVice: false,
        },
        {
          playerId: "b",
          position: "DEF" as const,
          isBench: true,
          isCaptain: false,
          isVice: false,
        },
      ],
      "a",
      "b",
    );
    expect(result?.find((p) => p.playerId === "a")).toMatchObject({
      isBench: true,
      isCaptain: false,
    });
    expect(result?.find((p) => p.playerId === "b")).toMatchObject({
      isBench: false,
      isCaptain: false,
    });
  });
});
