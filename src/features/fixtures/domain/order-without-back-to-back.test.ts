import { orderWithoutBackToBack } from "./order-without-back-to-back";

describe("orderWithoutBackToBack", () => {
  it("separates teams across consecutive slots when spare teams exist", () => {
    const ordered = orderWithoutBackToBack([
      { homeTeamId: "a", awayTeamId: "b" },
      { homeTeamId: "a", awayTeamId: "c" },
      { homeTeamId: "d", awayTeamId: "e" },
      { homeTeamId: "f", awayTeamId: "g" },
    ]);

    expect(ordered[0]).toEqual({ homeTeamId: "a", awayTeamId: "b" });
    expect(ordered[1]).toEqual({ homeTeamId: "d", awayTeamId: "e" });
    expect(ordered.slice(0, 2).flatMap((m) => [m.homeTeamId, m.awayTeamId])).toEqual([
      "a",
      "b",
      "d",
      "e",
    ]);
  });

  it("respects an existing previous slot when filling a day", () => {
    const ordered = orderWithoutBackToBack(
      [
        { homeTeamId: "a", awayTeamId: "c" },
        { homeTeamId: "d", awayTeamId: "e" },
      ],
      { homeTeamId: "a", awayTeamId: "b" },
    );

    expect(ordered[0]).toEqual({ homeTeamId: "d", awayTeamId: "e" });
  });
});
