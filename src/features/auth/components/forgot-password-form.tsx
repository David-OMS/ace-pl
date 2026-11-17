"use client";

import { useActionState } from "react";

import { Button } from "@/ui/button";
import { TextField } from "@/ui/text-field";

import { sendPasswordReset, type PasswordResetState } from "../actions/send-password-reset";
import { authCopy, describeActionError } from "../copy";

export function ForgotPasswordForm(): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<PasswordResetState, FormData>(
    sendPasswordReset,
    null,
  );

  if (state?.ok) {
    return (
      <p role="status" className="rounded-card border-2 border-line bg-surface-alt p-3 text-sm">
        {authCopy.resetSent}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <TextField
        label={authCopy.emailLabel}
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        placeholder={authCopy.emailPlaceholder}
      />
      <p className="text-xs text-muted">{authCopy.forgotPasswordPageNote}</p>
      {state && !state.ok ? (
        <p role="alert" className="text-sm font-bold text-hot">
          {describeActionError(state.error)}
        </p>
      ) : null}
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? authCopy.sendingReset : authCopy.sendReset}
      </Button>
    </form>
  );
}
