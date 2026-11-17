import type { ActionErrorCode } from "@/lib/action-result";

import type { SignInError } from "./routes";

export const authCopy = {
  signInTitle: "Sign in",
  signInIntro:
    "You only need an account for fantasy, Ballon d'Or voting and linking your player profile. Everything else is open.",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  sendLink: "Email me a sign-in link",
  sendingLink: "Sending…",
  linkSent: (email: string): string =>
    `Link sent to ${email}. Open it on this phone to sign in. It expires in an hour.`,
  divider: "or",
  continueWithGoogle: "Continue with Google",
  signIn: "Sign in",
  signOut: "Sign out",
  signedInAs: (name: string): string => `Signed in as ${name}`,
  actionErrors: {
    invalid_input: "That doesn't look like an email address.",
    rate_limited: "Too many links requested. Wait a minute and try again.",
    request_failed: "Couldn't send the link. Try again in a minute.",
  } satisfies Partial<Record<ActionErrorCode, string>>,
  fallbackError: "Something went wrong. Try again.",
  pageErrors: {
    link: "That sign-in link has expired or was already used. Request a new one.",
    google: "Google sign-in didn't work. Try again, or use an email link.",
  } satisfies Record<SignInError, string>,
} as const;

export function describeActionError(code: ActionErrorCode): string {
  const messages: Partial<Record<ActionErrorCode, string>> = authCopy.actionErrors;
  return messages[code] ?? authCopy.fallbackError;
}
