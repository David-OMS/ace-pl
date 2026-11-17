import type { Route } from "next";

export const SIGN_IN_PATH = "/sign-in";
export const SIGN_IN_NEXT_PARAM = "next";
export const SIGN_IN_ERROR_PARAM = "error";

export const SIGN_IN_ERRORS = ["link", "google"] as const;
export type SignInError = (typeof SIGN_IN_ERRORS)[number];

export function toSignInError(value: unknown): SignInError | null {
  return SIGN_IN_ERRORS.find((known) => known === value) ?? null;
}

/** Sign-in page that sends the user back to `returnPath` afterwards. */
export function buildSignInHref(returnPath: string): Route {
  const query = new URLSearchParams({ [SIGN_IN_NEXT_PARAM]: returnPath });
  return `${SIGN_IN_PATH}?${query.toString()}` as Route;
}
