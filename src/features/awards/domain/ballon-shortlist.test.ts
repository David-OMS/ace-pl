import { ballonShortlist } from "./ballon-shortlist";

describe("ballonShortlist", () => {
  it("returns the top five by stats score", () => {
    const rows = [
      { playerId: "1", name: "A", statsScore: 10 },
      { playerId: "2", name: "B", statsScore: 40 },
      { playerId: "3", name: "C", statsScore: 30 },
      { playerId: "4", name: "D", statsScore: 20 },
      { playerId: "5", name: "E", statsScore: 5 },
      { playerId: "6", name: "F", statsScore: 50 },
      { playerId: "7", name: "G", statsScore: 0 },
    ];
    expect(ballonShortlist(rows).map((r) => r.playerId)).toEqual(["6", "2", "3", "4", "1"]);
  });
});
