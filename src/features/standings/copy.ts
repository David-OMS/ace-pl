export const standingsCopy = {
  title: "League",
  empty: "No results yet.",
  noTournament: "No tournament to show.",
  formTitle: "Form",
  gameweekOf: (current: number, total: number): string => `GW ${current} of ${total}`,
  columns: {
    pos: "#",
    team: "Team",
    played: "P",
    won: "W",
    drawn: "D",
    lost: "L",
    goalsFor: "GF",
    goalsAgainst: "GA",
    goalDifference: "GD",
    points: "Pts",
  },
} as const;
