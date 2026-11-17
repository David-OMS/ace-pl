import { readTournamentForm, tournamentInputSchema } from "./tournament-input-schema";

function buildForm(overrides: Record<string, string> = {}): FormData {
  const fields = {
    name: " November Cup ",
    startsOn: "2026-11-01",
    endsOn: "2026-12-31",
    playersOnPitch: "6",
    squadSize: "10",
    matchesPerGameDay: "4",
    firstPlaceTiebreak: "discipline",
    keeperMode: "shared",
    ...overrides,
  };
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.set(key, value));
  return form;
}

function parse(form: FormData) {
  return tournamentInputSchema.safeParse(readTournamentForm(form));
}

describe("tournamentInputSchema", () => {
  it("reads numbers and dates from the form and starts new tournaments in setup", () => {
    expect(parse(buildForm()).data).toEqual({
      name: "November Cup",
      startsOn: "2026-11-01",
      endsOn: "2026-12-31",
      playersOnPitch: 6,
      squadSize: 10,
      matchesPerGameDay: 4,
      firstPlaceTiebreak: "discipline",
      keeperMode: "shared",
      status: "setup",
    });
  });

  it("rejects a squad smaller than the number on the pitch", () => {
    expect(parse(buildForm({ playersOnPitch: "7", squadSize: "6" })).success).toBe(false);
  });

  it("rejects an end date before the start date", () => {
    expect(parse(buildForm({ startsOn: "2026-12-01", endsOn: "2026-11-01" })).success).toBe(false);
  });

  it("rejects half numbers and empty values", () => {
    expect(parse(buildForm({ matchesPerGameDay: "4.5" })).success).toBe(false);
    expect(parse(buildForm({ matchesPerGameDay: "" })).success).toBe(false);
  });

  it("rejects an unknown tiebreak", () => {
    expect(parse(buildForm({ firstPlaceTiebreak: "coin toss" })).success).toBe(false);
  });

  it("ignores a status posted from the form and keeps setup", () => {
    expect(parse(buildForm({ status: "abandoned" })).data?.status).toBe("setup");
  });
});
