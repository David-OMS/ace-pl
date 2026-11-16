type LogLevel = "debug" | "info" | "warn" | "error";
type LogContext = Record<string, unknown>;

function serialiseError(value: unknown): unknown {
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack };
  }
  return value;
}

function write(level: LogLevel, event: string, context: LogContext = {}): void {
  const entry = {
    level,
    event,
    time: new Date().toISOString(),
    ...Object.fromEntries(
      Object.entries(context).map(([key, value]) => [key, serialiseError(value)]),
    ),
  };
  // One JSON line per entry so Vercel's log search can filter on fields.
  console[level](JSON.stringify(entry));
}

/** Structured logger. Use snake_case event names, e.g. logger.error("publish_result_failed", {...}). */
export const logger = {
  debug: (event: string, context?: LogContext): void => write("debug", event, context),
  info: (event: string, context?: LogContext): void => write("info", event, context),
  warn: (event: string, context?: LogContext): void => write("warn", event, context),
  error: (event: string, context?: LogContext): void => write("error", event, context),
};
