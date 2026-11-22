export {
  aggregatePlayerStats,
  topByMetric,
  type LeaderboardMetric,
  type PlayerStatTotals,
  type StatEvent,
  type AppearanceRow,
} from "./domain/aggregate-player-stats";
export { countAssistsFromEvents } from "./domain/count-assists-from-events";
export { countCleanSheets, countFantasyCleanSheets } from "./domain/count-clean-sheets";
export { filterCompletedMatchScope } from "./domain/filter-completed-match-scope";
export { mergeStatExtras } from "./domain/merge-stat-extras";
