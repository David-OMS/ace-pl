export type ActionErrorCode =
  | "invalid_input"
  | "unauthenticated"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "request_failed"
  | "save_failed";

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: ActionErrorCode };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function fail<T = never>(error: ActionErrorCode): ActionResult<T> {
  return { ok: false, error };
}
