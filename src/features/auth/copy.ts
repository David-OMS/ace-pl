import type { ActionErrorCode } from "@/lib/action-result";

import type { SignInError } from "./routes";

export const authCopy = {
  signInTitle: "Sign in",
  signInIntro: "You only need an account for fantasy, and Baller d'Or voting",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  nameLabel: "Name",
  passwordLabel: "Password",
  signInButton: "Sign in",
  signingIn: "Signing in…",
  createAccountTitle: "Create account",
  createAccount: "Create an account",
  creatingAccount: "Creating…",
  alreadyHaveAccount: "Already have an account? Sign in.",
  forgotPasswordNote: "If you like forget your password, na you sabi.",
  forgotPasswordPageNote: "So you actually forgot it smh",
  forgotPasswordLink: "Forgot your password?",
  forgotPasswordTitle: "Reset password",
  sendReset: "Email me a reset link",
  sendingReset: "Sending…",
  resetSent: "Check that inbox for a link to set a new password.",
  newPasswordTitle: "New password",
  newPasswordIntro: "The reset link checked out. Pick a new password.",
  savePassword: "Save password",
  savingPassword: "Saving…",
  resetLinkExpired: "That reset link has expired. Request a new one.",
  sendLink: "Email me a sign-in link",
  sendingLink: "Sending…",
  linkSent: (email: string): string =>
    `Link sent to ${email}. Open that email on this phone. A new request kills this link.`,
  confirmTitle: "Sign in",
  confirmBody: "Tap the button to finish. Opening the email is not enough.",
  confirmButton: "Sign in",
  divider: "or",
  continueWithGoogle: "Continue with Google",
  signIn: "Sign in",
  signOut: "Sign out",
  signedInAs: (name: string): string => `Signed in as ${name}`,
  actionErrors: {
    invalid_input: "Check the email and password. Use at least 8 characters.",
    conflict: "That email already has an account. Sign in with it.",
    unauthenticated: "That reset link has expired. Request a new one.",
    rate_limited: "Too many tries. Wait a minute, then try once.",
    request_failed: "Couldn't do that. Try again in a minute.",
  } satisfies Partial<Record<ActionErrorCode, string>>,
  fallbackError: "Something went wrong. Try again.",
  pageErrors: {
    link: "That link was already used or it expired. Request one new email, then open only that one.",
    google: "Google sign-in didn't work. Try again, or use your email and password.",
  } satisfies Record<SignInError, string>,
} as const;

export function describeActionError(code: ActionErrorCode): string {
  const messages: Partial<Record<ActionErrorCode, string>> = authCopy.actionErrors;
  return messages[code] ?? authCopy.fallbackError;
}
